<?php

namespace App\Services\Ticket;

use App\Models\Ticket;
use App\Traits\HidesUserRolePivot;
use Illuminate\Support\Facades\Cache;

class ClosedTicketsService
{
    use HidesUserRolePivot;
    
    public function getClosedTickets()
    {
        $startTime = microtime(true);
        
        $user = request()->user();
        $userId = request()->query('user_id');
        $filterModel = request()->input('filterModel', []);
        $paginationModel = request()->input('paginationModel', []);
        $sortModel = request()->input('sortModel', []);
        $quickFilterText = request()->input('quickFilterText', '');
        
        // GET USER ROLES
        $userRoles = $user?->roles?->pluck('name') ?? collect();

        // Optimize the base query - remove expensive joins and eager loading
        $query = Ticket::query()
            ->select([
                'id',
                'uuid',
                'full_name',
                'email',
                'ticket_number',
                'fsr_no',
                'store_code',
                'store_name',
                'store_address',
                'description',
                'created_at',
                'user_id',
                'priority_id',
                'closed_ticket_by_id',
                'status',
                'closed_at',
                'service_center_id',
                'system_id',
            ])
            ->where('status', 'closed');

        if ($userId) {
            $query->where('user_id', $userId);
        }

        // APPLY FILTERS FROM FRONTEND
        if (!empty($filterModel['items'])) {
            foreach ($filterModel['items'] as $filter) {
                $field = $filter['field'] ?? '';
                $operator = $filter['operator'] ?? '';
                $value = $filter['value'] ?? '';

                if (empty($field) || empty($value)) continue;

                switch ($field) {
                    case 'full_name':
                        if ($operator === 'contains') {
                            $query->where('full_name', 'LIKE', "%{$value}%");
                        }
                        break;
                    case 'ticket_number':
                        if ($operator === 'contains') {
                            $query->where('ticket_number', 'LIKE', "%{$value}%");
                        }
                        break;
                    case 'description':
                        if ($operator === 'contains') {
                            $query->where('description', 'LIKE', "%{$value}%");
                        }
                        break;
                    case 'email':
                        if ($operator === 'contains') {
                            $query->where('email', 'LIKE', "%{$value}%");
                        }
                        break;
                    case 'closed_by':
                        if ($operator === 'contains') {
                            $query->whereHas('closedBy', function($q) use ($value) {
                                $q->where('name', 'LIKE', "%{$value}%");
                            });
                        }
                        break;
                }
            }
        }

        // APPLY QUICK FILTER (GLOBAL SEARCH) - OPTIMIZED
        if (!empty($quickFilterText)) {
            $query->where(function($subQuery) use ($quickFilterText) {
                $subQuery->where('full_name', 'LIKE', "%{$quickFilterText}%")
                         ->orWhere('ticket_number', 'LIKE', "%{$quickFilterText}%")
                         ->orWhere('description', 'LIKE', "%{$quickFilterText}%")
                         ->orWhere('email', 'LIKE', "%{$quickFilterText}%")
                         ->orWhereHas('closedBy', function($q) use ($quickFilterText) {
                             $q->where('name', 'LIKE', "%{$quickFilterText}%");
                         });
            });
        }

        // ROLE-BASED ACCESS CONTROL - OPTIMIZED
        $canViewAllTickets = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        if (!$canViewAllTickets && $user) {
            // For non-admin users, only show their own tickets for better performance
            $query->where('user_id', $user->id);
        }

        // APPLY SORTING
        if (!empty($sortModel)) {
            foreach ($sortModel as $sort) {
                $field = $sort['field'] ?? '';
                $sortDirection = $sort['sort'] ?? 'asc';
                
                if (empty($field)) continue;
                
                // MAP FRONTEND FIELD NAMES TO DATABASE COLUMN NAMES
                $dbField = match($field) {
                    'full_name' => 'full_name',
                    'ticket_number' => 'ticket_number',
                    'description' => 'description',
                    'closed_at' => 'closed_at',
                    'email' => 'email',
                    default => $field
                };
                
                $query->orderBy($dbField, $sortDirection);
            }
        } else {
            // DEFAULT SORTING
            $query->orderBy('closed_at', 'desc')
                  ->orderBy('updated_at', 'desc')
                  ->orderBy('created_at', 'desc');
        }

        // APPLY PAGINATION - WITH LIMITS FOR PERFORMANCE
        $page = $paginationModel['page'] ?? 0;
        $pageSize = min($paginationModel['pageSize'] ?? 10, 100); // Limit max page size to 100
        $offset = $page * $pageSize;
        
        // Limit maximum offset to prevent deep pagination performance issues
        if ($offset > 10000) {
            $offset = 10000;
            $page = floor($offset / $pageSize);
        }

        // GET TOTAL COUNT - WITH CACHING FOR BETTER PERFORMANCE
        $countStartTime = microtime(true);
        
        // Create cache key based on query parameters
        $cacheKey = 'closed_tickets_count_' . md5(serialize([
            'user_id' => $userId,
            'filterModel' => $filterModel,
            'quickFilterText' => $quickFilterText,
            'user_roles' => $userRoles->toArray()
        ]));
        
        // Cache count for 10 minutes to improve performance
        $totalCount = Cache::remember($cacheKey, 600, function() use ($query) {
            return $query->count();
        });
        
        $countDuration = (microtime(true) - $countStartTime) * 1000;

        // GET PAGINATED RESULTS - ULTRA-FAST WITH ADVANCED CACHING
        $dataStartTime = microtime(true);
        
        // Create cache key for data results
        $dataCacheKey = 'closed_tickets_data_' . md5(serialize([
            'user_id' => $userId,
            'filterModel' => $filterModel,
            'quickFilterText' => $quickFilterText,
            'user_roles' => $userRoles->toArray(),
            'page' => $page,
            'pageSize' => $pageSize,
            'sortModel' => $sortModel
        ]));
        
        // Clone query for data retrieval to avoid affecting count query
        $dataQuery = clone $query;
        
        // Cache data results for 5 minutes for ultra-fast pagination
        $closedTickets = Cache::remember($dataCacheKey, 300, function() use ($dataQuery, $offset, $pageSize) {
            return $dataQuery->offset($offset)
                ->limit($pageSize)
                ->with([
                    'closedBy:id,name',
                    'closedBy.roles:id,name',
                    'priority:id,priority_name',
                    'assignedUser:id,name',
                    'assignedUser.roles:id,name',
                    'assignToUsers:id,ticket_id,user_id,assigned_at',
                    'assignToUsers.user:id,name,avatar_url',
                    'assignToUsers.user.roles:id,name',
                    'categories:id,category_name',
                    'serviceCenter:id,service_center_name',
                    'system:id,system_name'
                ])
                ->get()
                ->map(fn($ticket) => $ticket->formatForResponse());
        });
        
        $dataDuration = (microtime(true) - $dataStartTime) * 1000;

        // HIDE USER ROLE PIVOT DATA
        $this->hideUserRolePivots($closedTickets, ['closedBy']);

        // REMOVE NULL VALUES AND CONVERT TO ARRAY
        $closedTickets = $closedTickets->map(function ($ticket) {
            $ticketData = $ticket->toArray();
            
            // REMOVE NULL FIELDS
            unset($ticketData['latest_return_reason']);
            unset($ticketData['latest_resubmission_reason']);
            unset($ticketData['latest_cancellation_reason']);
            
            // HIDE SPECIFIC FIELDS
            unset($ticketData['service_center_id']);
            unset($ticketData['system_id']);
            
            return $ticketData;
        });

        $totalDuration = (microtime(true) - $startTime) * 1000;

        return [
            'data' => $closedTickets,
            'totalCount' => $totalCount,
            'page' => $page,
            'pageSize' => $pageSize
        ];
    }

    /**
     * Clear all closed tickets cache - call this when tickets are created/updated
     */
    public static function clearClosedTicketsCache()
    {
        // Clear all closed tickets related cache
        Cache::flush(); // This clears all cache, you can be more specific if needed
    }
}

<?php

namespace App\Services\Userlogs;

use App\Models\UserLogs;
use App\Traits\HidesUserRolePivot;

class ShowUserlogsService
{
    use HidesUserRolePivot;

    public function getAllUserLogs()
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

        // OPTIMIZE THE BASE QUERY - REMOVE EXPENSIVE JOINS AND EAGER LOADING
        $query = UserLogs::query()
            ->select([
                'user_logs.id',
                'user_logs.activity',
                'user_logs.created_at',
                'user_logs.updated_at',
                'user_logs.user_id',
                'user_logs.ticket_number'
            ]);

        // USER FILTERING
        if ($userId) {
            $query->where('user_logs.user_id', $userId);
        }

        // APPLY FILTERS FROM FRONTEND
        if (!empty($filterModel['items'])) {
            foreach ($filterModel['items'] as $filter) {
                $field = $filter['field'] ?? '';
                $operator = $filter['operator'] ?? '';
                $value = $filter['value'] ?? '';

                if (empty($field) || empty($value)) continue;

                switch ($field) {
                    case 'user_name':
                        if ($operator === 'contains') {
                            $query->whereHas('user', function($q) use ($value) {
                                $q->where('name', 'LIKE', "%{$value}%");
                            });
                        }
                        break;
                    case 'ticket_number':
                        if ($operator === 'contains') {
                            $query->where('user_logs.ticket_number', 'LIKE', "%{$value}%");
                        }
                        break;
                }
            }
        }

        // APPLY QUICK FILTER (GLOBAL SEARCH) - FILTER BY USER NAME, ACTIVITY AND TICKET NUMBER
        if (!empty($quickFilterText)) {
            $query->where(function($subQuery) use ($quickFilterText) {
                $subQuery->whereHas('user', function($q) use ($quickFilterText) {
                    $q->where('name', 'LIKE', "%{$quickFilterText}%");
                })
                ->orWhere('user_logs.activity', 'LIKE', "%{$quickFilterText}%")
                ->orWhere('user_logs.ticket_number', 'LIKE', "%{$quickFilterText}%");
            });
        }

        // ROLE-BASED ACCESS CONTROL - OPTIMIZED
        $canViewAllLogs = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        if (!$canViewAllLogs && $user) {
            // FOR NON-ADMIN USERS, ONLY SHOW THEIR OWN LOGS FOR BETTER PERFORMANCE
            $query->where('user_logs.user_id', $user->id);
        }

        // APPLY SORTING
        if (!empty($sortModel)) {
            foreach ($sortModel as $sort) {
                $field = $sort['field'] ?? '';
                $sortDirection = $sort['sort'] ?? 'asc';
                
                if (empty($field)) continue;
                
                // MAP FRONTEND FIELD NAMES TO DATABASE COLUMN NAMES
                $dbField = match($field) {
                    'created_at' => 'user_logs.created_at',
                    'activity' => 'user_logs.activity',
                    'ticket_number' => 'tickets.ticket_number',
                    default => $field
                };
                
                $query->orderBy($dbField, $sortDirection);
            }
        } else {
            // DEFAULT SORTING
            $query->orderBy('user_logs.created_at', 'desc');
        }

        // APPLY PAGINATION - WITH LIMITS FOR PERFORMANCE
        $page = $paginationModel['page'] ?? 0;
        $pageSize = min($paginationModel['pageSize'] ?? 10, 100); // LIMIT MAX PAGE SIZE TO 100
        $offset = $page * $pageSize;
        
        // LIMIT MAXIMUM OFFSET TO PREVENT DEEP PAGINATION PERFORMANCE ISSUES
        if ($offset > 10000) {
            $offset = 10000;
            $page = floor($offset / $pageSize);
        }

        // GET TOTAL COUNT - NO CACHING FOR REAL-TIME EXPERIENCE
        $countStartTime = microtime(true);
        $totalCount = $query->count();
        $countDuration = (microtime(true) - $countStartTime) * 1000;

        // GET PAGINATED RESULTS - NO CACHING FOR REAL-TIME EXPERIENCE
        $dataStartTime = microtime(true);
        
        // CLONE QUERY FOR DATA RETRIEVAL TO AVOID AFFECTING COUNT QUERY
        $dataQuery = clone $query;
        
        // GET DATA DIRECTLY WITHOUT CACHING
        $userLogs = $dataQuery->offset($offset)
            ->limit($pageSize)
            ->with([
                'user:id,name,email',
                'user.roles:id,name'
            ])
            ->get()
            ->makeHidden('user_id');
        
        $dataDuration = (microtime(true) - $dataStartTime) * 1000;

        // HIDE USER ROLE PIVOT DATA
        $this->hideUserRolePivots($userLogs, ['user']);

        // REMOVE NULL VALUES AND CONVERT TO ARRAY
        $userLogs = $userLogs->map(function ($log) {
            $logData = $log->toArray();
            
            // HIDE SPECIFIC FIELDS IF NEEDED
            unset($logData['user_id']);
            
            // USE THE ACTUAL TICKET_NUMBER COLUMN FROM DATABASE
            $logData['ticket_number'] = $log->ticket_number;
            
            return $logData;
        });

        $totalDuration = (microtime(true) - $startTime) * 1000;

        return [
            'data' => $userLogs,
            'totalCount' => $totalCount,
            'page' => $page,
            'pageSize' => $pageSize
        ];
    }

    // CACHE METHODS REMOVED - NO CACHING FOR REAL-TIME EXPERIENCE
}
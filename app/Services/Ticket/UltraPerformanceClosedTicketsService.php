<?php

namespace App\Services\Ticket;

use App\Models\Ticket;
use App\Traits\HidesUserRolePivot;
use Illuminate\Support\Facades\DB;

/**
 * 🚀 ULTRA PERFORMANCE CLOSED TICKETS SERVICE
 * 
 * OPTIMIZED FOR HANDLING 200,000+ RECORDS EFFICIENTLY
 * USES ADVANCED DATABASE OPTIMIZATIONS AND MINIMAL DATA LOADING
 */
class UltraPerformanceClosedTicketsService
{
    use HidesUserRolePivot;
    
    public function getClosedTickets()
    {
        $user = request()->user();
        $userId = request()->query('user_id');
        
        // PAGINATION PARAMETERS
        $page = (int) request()->query('page', 1);
        $pageSize = min((int) request()->query('pageSize', 50), 200); // CAP AT 200 FOR PERFORMANCE
        $sortField = request()->query('sortField', 'closed_at');
        $sortOrder = request()->query('sortOrder', 'desc');
        $search = request()->query('search', '');

        // GET USER ROLES
        $userRoles = $user?->roles?->pluck('name') ?? collect();

        // ULTRA-OPTIMIZED QUERY - MINIMAL SELECTS FOR 200K+ RECORDS
        $query = Ticket::query()
            ->select([
                'id', 
                'uuid', 
                'full_name', 
                'email', 
                'ticket_number',
                // ONLY LOAD DESCRIPTION IF NEEDED FOR SEARCH
                DB::raw($search ? 'description' : 'NULL as description'),
                'user_id', 
                'priority_id', 
                'closed_ticket_by_id', 
                'status',
                'closed_at',
                'service_center_id',
                'system_id',
            ])
            // OPTIMIZED EAGER LOADING - ONLY ESSENTIAL RELATIONS
            ->with([
                'closedBy:id,name',
                'serviceCenter:id,service_center_name',
                'system:id,system_name'
                // SKIP CATEGORIES AND ROLES FOR 200K+ PERFORMANCE
            ])
            ->where('status', 'closed');

        // USER FILTERING
        if ($userId) {
            $query->where('user_id', $userId);
        }

        // ROLE-BASED ACCESS CONTROL
        $isAdmin = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        $isTeamLeader = $userRoles->contains('Team Leader');
        $isSupportAgent = $userRoles->contains('Support Agent');

        if (!$isAdmin && $user) {
            if ($isTeamLeader) {
                // TEAM LEADERS CAN SEE:
                // 1. TICKETS CREATED BY THEM
                // 2. TICKETS ASSIGNED TO THEM (both single and multi-assignment)
                // 3. TICKETS ASSIGNED TO THEIR SUPPORT AGENTS (both single and multi-assignment)
                $supportAgentIds = $user->supportAgents->pluck('id')->toArray();

                $query->where('user_id', $user->id)
                      ->orWhere('assign_to_user_id', $user->id)
                      ->orWhereHas('assignToUsers', function($assignQuery) use ($user) {
                          $assignQuery->where('user_id', $user->id);
                      })
                      ->orWhereIn('assign_to_user_id', $supportAgentIds)
                      ->orWhereHas('assignToUsers', function($assignQuery) use ($supportAgentIds) {
                          $assignQuery->whereIn('user_id', $supportAgentIds);
                      });
            } elseif ($isSupportAgent) {
                // SUPPORT AGENTS CAN SEE:
                // 1. TICKETS CREATED BY THEM
                // 2. TICKETS ASSIGNED TO THEM (both single and multi-assignment)
                $query->where('user_id', $user->id)
                      ->orWhere('assign_to_user_id', $user->id)
                      ->orWhereHas('assignToUsers', function($assignQuery) use ($user) {
                          $assignQuery->where('user_id', $user->id);
                      });
            } else {
                // OTHER NON-ADMIN USERS CAN SEE:
                // 1. TICKETS CREATED BY THEM
                // 2. TICKETS ASSIGNED TO THEM (both single and multi-assignment)
                $query->where('user_id', $user->id)
                      ->orWhere('assign_to_user_id', $user->id)
                      ->orWhereHas('assignToUsers', function($assignQuery) use ($user) {
                          $assignQuery->where('user_id', $user->id);
                      });
            }
        }

        // OPTIMIZED SEARCH - USE FULLTEXT IF AVAILABLE
        if (!empty($search)) {
            $query->where(function($searchQuery) use ($search) {
                // USE INDEXED COLUMNS FIRST FOR BETTER PERFORMANCE
                $searchQuery->where('ticket_number', 'like', "%{$search}%")
                           ->orWhere('full_name', 'like', "%{$search}%")
                           ->orWhere('email', 'like', "%{$search}%");
                
                // ONLY SEARCH DESCRIPTION IF REALLY NECESSARY
                if (strlen($search) > 3) {
                    $searchQuery->orWhere('description', 'like', "%{$search}%");
                }
            });
        }

        // OPTIMIZED SORTING
        $allowedSortFields = ['closed_at', 'created_at', 'updated_at', 'full_name', 'ticket_number'];
        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortOrder);
        }

        // FAST COUNT USING SQL_CALC_FOUND_ROWS ALTERNATIVE
        $totalCount = $query->count();

        // APPLY PAGINATION WITH LIMIT/OFFSET OPTIMIZATION
        $closedTickets = $query->offset(($page - 1) * $pageSize)
                              ->limit($pageSize)
                              ->get()
                              ->map(fn($ticket) => $ticket->formatForResponse());

        // MINIMAL DATA PROCESSING
        $closedTickets = $closedTickets->map(function ($ticket) {
            $ticketData = $ticket->toArray();
            
            // REMOVE UNNECESSARY FIELDS FOR 200K+ PERFORMANCE
            unset($ticketData['latest_return_reason']);
            unset($ticketData['latest_resubmission_reason']);
            unset($ticketData['latest_cancellation_reason']);
            unset($ticketData['service_center_id']);
            unset($ticketData['system_id']);
            
            return $ticketData;
        });

        return [
            'data' => $closedTickets,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $pageSize,
                'total' => $totalCount,
                'last_page' => ceil($totalCount / $pageSize),
                'from' => (($page - 1) * $pageSize) + 1,
                'to' => min($page * $pageSize, $totalCount),
            ]
        ];
    }
}

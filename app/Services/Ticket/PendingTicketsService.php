<?php

namespace App\Services\Ticket;

use App\Models\Ticket;
use App\Traits\HidesUserRolePivot;

class PendingTicketsService
{
    use HidesUserRolePivot;

    public function getPendingTickets()
    {
        $user = request()->user();
        $userRoles = $user->roles->pluck('name');
        $isAdmin = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        $isTeamLeader = $userRoles->contains('Team Leader');
        $isSupportAgent = $userRoles->contains('Support Agent');

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
                'status',
                'created_at', 
                'assign_to_user_id', 
                'assigned_by_id',
                'priority_id', 
                'user_id',
                'returned_by_id',
                'service_center_id',
                'system_id',
            ])
            ->with([
                'serviceCenter:id,service_center_name',
                'system:id,system_name',
                'categories:id,category_name',
                'priority:id,priority_name',
                'assignedUser:id,name',
                'assignedUser.roles:id,name',
                'assignToUsers:id,ticket_id,user_id',
                'assignToUsers.user:id,uuid,name',
                'assignToUsers.user.roles:id,name',
                'assignmentHistory:id,ticket_id,assigned_by_user_id,assigned_at',
                'assignmentHistory.assignedBy:id,uuid,name',
                'assignmentHistory.assignedBy.roles:id,name',
                'assignedBy:id,name',
                'assignedBy.roles:id,name',
                'returnedBy:id,name',
                'returnedBy.roles:id,name',
            ])
            ->whereIn('status', ['re-open', 'resubmitted', 'new_ticket', 'returned', 'assigned', 'follow-up', 'reminder'])
            ->when(!$isAdmin, function($query) use ($user, $isTeamLeader, $isSupportAgent) {
                if ($isTeamLeader) {
                    // TEAM LEADERS CAN SEE:
                    // UNASSIGNED NEW TICKETS (for assignment purposes)
                    $query->whereNull('assign_to_user_id')
                          ->where('status', 'new_ticket');
                } elseif ($isSupportAgent) {
                    // SUPPORT AGENTS CAN SEE TICKETS ASSIGNED TO THEM
                    // Either as primary assignee OR in assign_ticket_to_users table
                    $query->where(function($q) use ($user) {
                        $q->where('assign_to_user_id', $user->id)
                          ->orWhereHas('assignToUsers', function($assignQuery) use ($user) {
                              $assignQuery->where('user_id', $user->id);
                          });
                    });
                } else {
                    // OTHER NON-ADMIN USERS CAN SEE UNASSIGNED TICKETS THEY CREATED
                    $query->whereNull('assign_to_user_id')
                          ->where('user_id', $user->id);
                }
            });

        // DEFINE STATUS PRIORITY ORDER
        $statusPriority = [
            'new_ticket' => 1,
            'assigned' => 2,
            'returned' => 3,
            'resubmitted' => 4,
            'reminder' => 5,
            'follow-up' => 6,
            're-open' => 7,
        ];

        // FETCH AND SORT TICKETS USING ELOQUENT COLLECTIONS
        $tickets = $query->get()
            ->sortBy([
                fn($a, $b) => ($statusPriority[$a->status] ?? 999) <=> ($statusPriority[$b->status] ?? 999),
                fn($a, $b) => $b->created_at <=> $a->created_at,
            ])
            ->values();

        $summary = $tickets->groupBy('status')
            ->map(fn($group) => $group->count())
            ->pipe(fn($counts) => [
                'new_ticket_count' => $counts->get('new_ticket', 0),
                'assigned_count' => $counts->get('assigned', 0),
                'returned_count' => $counts->get('returned', 0),
                'resubmitted_count' => $counts->get('resubmitted', 0),
                'reminder_count' => $counts->get('reminder', 0),
                'follow_up_count' => $counts->get('follow-up', 0),
                're_open_count' => $counts->get('re-open', 0),
            ]);

        $pendingTickets = $tickets->map(function ($ticket) use ($user) {
            // Sort assignToUsers so current user appears first if assigned
            if ($ticket->assignToUsers) {
                $ticket->assignToUsers = $ticket->assignToUsers->sort(function ($a, $b) use ($user) {
                    // Current user should appear first
                    if ($a->user_id === $user->id) return -1;
                    if ($b->user_id === $user->id) return 1;

                    // Sort by assigned_at timestamp (oldest first)
                    return $a->assigned_at <=> $b->assigned_at;
                })->values();
            }

            $baseTicket = $ticket->formatForResponse();

            unset($baseTicket->assigned_user);
            unset($baseTicket->assigned_by);
            unset($baseTicket->returned_by);

            // HIDE ROLE PIVOTS FROM ANY REMAINING USER RELATIONS
            $this->hideUserRolePivots($baseTicket, ['assignedUser', 'assignedBy', 'returnedBy']);

            // REMOVE REDUNDANT REASON FIELDS
            unset($baseTicket->latest_cancellation_reason);
            unset($baseTicket->latest_return_reason);
            unset($baseTicket->latest_resubmission_reason);

            // HIDE SPECIFIC FIELDS
            unset($baseTicket->returned_by_id);
            unset($baseTicket->service_center_id);
            unset($baseTicket->system_id);

            return $baseTicket;
        });

        return [
            'pending_tickets' => $pendingTickets,
            'summary' => $summary
        ];
    }
}

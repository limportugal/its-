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
                'assignedBy:id,name',
                'assignedBy.roles:id,name',
                'returnedBy:id,name',
                'returnedBy.roles:id,name',
            ])
            ->whereIn('status', ['re-open', 'resubmitted', 'new_ticket', 'returned', 'assigned', 'follow-up', 'reminder'])
            ->when(!$isAdmin, fn($q) => $q->where(function($query) use ($user, $isTeamLeader, $isSupportAgent) {
                if ($isTeamLeader) {
                    // TEAM LEADERS CAN SEE:
                    // 1. ALL NEW_TICKET STATUS TICKETS
                    // 2. ALL TICKETS ASSIGNED TO THEIR SUPPORT AGENTS
                    $supportAgentIds = $user->supportAgents->pluck('id')->toArray();
                    
                    $query->where(function($subQuery) use ($user, $supportAgentIds) {
                        // NEW TICKETS (not assigned to anyone yet)
                        $subQuery->where('status', 'new_ticket')
                                // OR TICKETS ASSIGNED TO THE TEAM LEADER
                                ->orWhere('assign_to_user_id', $user->id)
                                // OR TICKETS ASSIGNED TO ANY OF THEIR SUPPORT AGENTS
                                ->orWhereIn('assign_to_user_id', $supportAgentIds);
                    });
                } elseif ($isSupportAgent) {
                    // SUPPORT AGENTS CAN ONLY SEE TICKETS ASSIGNED TO THEM
                    $query->where('assign_to_user_id', $user->id);
                } else {
                    // OTHER NON-ADMIN USERS CAN SEE TICKETS THEY CREATED OR ASSIGNED TO THEM
                    $query->where('user_id', $user->id)
                          ->orWhere('assign_to_user_id', $user->id);
                }
            }))
            ->orderBy('updated_at', 'desc')
            ->orderBy('submitted_at', 'desc')
            ->orderBy('returned_at', 'desc')
            ->orderBy('assigned_at', 'desc')
            ->orderBy('created_at', 'desc');

        $tickets = $query->get();

        $summary = $tickets->groupBy('status')
            ->map(fn($group) => $group->count())
            ->pipe(fn($counts) => [
                'new_ticket_count' => $counts->get('new_ticket', 0),
                're_open_count' => $counts->get('re-open', 0),
                'returned_count' => $counts->get('returned', 0),
                'resubmitted_count' => $counts->get('resubmitted', 0),
                'assigned_count' => $counts->get('assigned', 0),
                'reminder_count' => $counts->get('reminder', 0),
                'follow_up_count' => $counts->get('follow-up', 0),
            ]);

        $pendingTickets = $tickets->map(function ($ticket) {
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

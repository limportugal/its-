<?php

namespace App\Services\Ticket;

use App\Models\Ticket;
use App\Traits\HidesUserRolePivot;
use Illuminate\Support\Facades\Auth;

class CancelledTicketsService
{
    use HidesUserRolePivot;
    public function getCancelledTickets()
    {
        $query = Ticket::select(
            'id', 
            'uuid', 
            'full_name',
            'email',
            'ticket_number',
            'description', 
            'cancelled_at',
            'cancelled_ticket_by_id',
            'status',
            'service_center_id',
            'system_id',
        )
        ->with([
            'cancelledBy:id,name,email',
            'cancelledBy.roles:id,name',
            'categories:id,category_name',
            'serviceCenter:id,service_center_name',
            'system:id,system_name'
        ])
            ->orderBy('cancelled_at', 'desc')
            ->where('status', 'cancelled');

        // CHECK IF USER IS SUPER ADMIN, ADMIN, OR MANAGER
        $user = Auth::user();
        $userRoles = $user->roles->pluck('name');
        $canViewAllTickets = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        // TEAM LEADERS CAN SEE TICKETS ASSIGNED TO THEM AND THEIR SUPPORT AGENTS
        $isTeamLeader = $userRoles->contains('Team Leader');
        
        if (!$canViewAllTickets) {
            // ONLY SHOW TICKETS CREATED BY OR ASSIGNED TO THE CURRENT USER
            $query->where(function($q) use ($user, $isTeamLeader) {
                if ($isTeamLeader) {
                    // TEAM LEADERS CAN SEE:
                    // 1. TICKETS CREATED BY THEM
                    // 2. TICKETS ASSIGNED TO THEM
                    // 3. TICKETS ASSIGNED TO THEIR SUPPORT AGENTS
                    $supportAgentIds = $user->supportAgents->pluck('id')->toArray();
                    
                    $q->where('user_id', $user->id)
                      ->orWhere('assign_to_user_id', $user->id)
                      ->orWhereIn('assign_to_user_id', $supportAgentIds);
                } else {
                    // OTHER ROLES CAN ONLY SEE TICKETS CREATED BY OR ASSIGNED TO THEM
                    $q->where('user_id', $user->id)
                      ->orWhere('assign_to_user_id', $user->id);
                }
            });
        }

        $cancelledTickets = $query->orderBy('updated_at', 'desc')->get();

        // HIDE PIVOT DATA FROM ROLES AND HIDE cancelled_ticket_by_id
        $this->hideUserRolePivots($cancelledTickets, ['cancelledBy']);
        $cancelledTickets->makeHidden('cancelled_ticket_by_id');
        
        // HIDE SPECIFIC FIELDS
        $cancelledTickets->makeHidden(['service_center_id', 'system_id']);
        
        // HIDE PIVOT DATA FROM CATEGORIES
        $cancelledTickets->each(function ($ticket) {
            $ticket->categories->each(function ($category) {
                $category->makeHidden('pivot');
            });
        });

        return response()->json($cancelledTickets);
    }
}

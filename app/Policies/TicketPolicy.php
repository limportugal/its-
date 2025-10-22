<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Ticket;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\Access\HandlesAuthorization;

class TicketPolicy
{
    use HandlesAuthorization;

    public function update(User $authUser, Ticket $ticket): bool
    {
        // CHECK IF USER HAS PERMISSION OR IS IN ALLOWED ROLES
        $userRoles = $authUser->roles->pluck('name');
        $isCanUpdate = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager', 'Team Leader', 'Support Agent']));
        
        if (!$isCanUpdate && !$authUser->hasPermissionTo('update_pending_ticket')) {
            throw new AuthorizationException('You do not have permission to update this ticket.');
        }

        // CHECK IF USER IS ASSIGNED TO TICKET OR IS ADMIN
        if ($ticket->assign_to_user_id !== $authUser->id && !$isCanUpdate) {
            throw new AuthorizationException('You can only update tickets assigned to you.');
        }

        return true;
    }

    public function close(User $authUser, Ticket $ticket): bool
    {
        // CHECK IF USER HAS PERMISSION OR IS IN ALLOWED ROLES
        $userRoles = $authUser->roles->pluck('name');
        $isCanClose = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager', 'Team Leader', 'Support Agent']));
        
        if (!$isCanClose && !$authUser->hasPermissionTo('update_pending_ticket')) {
            throw new AuthorizationException('You do not have permission to close this ticket.');
        }

        // CHECK IF USER IS ASSIGNED TO TICKET OR IS ADMIN
        if ($ticket->assign_to_user_id !== $authUser->id && !$isCanClose) {
            throw new AuthorizationException('You can only close tickets assigned to you.');
        }

        // CHECK IF TICKET STATUS ALLOWS CLOSING (applies to ALL users including Super Admin)
        if (!in_array($ticket->status, ['assigned', 'resubmitted', 're-open', 'follow-up', 'reminder', 'returned'])) {
            throw new AuthorizationException('Only assigned, returned, resubmitted, re-open, follow-up, and reminder tickets can be closed.');
        }

        return true;
    }

    public function delete(User $authUser): bool
    {
        if (! $authUser->hasPermissionTo('delete_pending_ticket')) {
            throw new AuthorizationException('You do not have permission to delete the ticket.');
        }

        // CHECK IF USER IS SUPER ADMIN
        $userRoles = $authUser->roles->pluck('name');
        $isSuperAdmin = $userRoles->contains('Super Admin');
        
        if (!$isSuperAdmin) {
            throw new AuthorizationException('Only Super Admin can delete tickets.');
        }

        return true;
    }

    public function return(User $authUser, Ticket $ticket): bool
    {
        // CHECK IF USER HAS PERMISSION OR IS IN ALLOWED ROLES
        $userRoles = $authUser->roles->pluck('name');
        $isCanReturn = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager', 'Team Leader', 'Support Agent']));
        
        if (!$isCanReturn && !$authUser->hasPermissionTo('update_pending_ticket')) {
            throw new AuthorizationException('You do not have permission to return the ticket.');
        }

        // CHECK IF USER IS ASSIGNED TO TICKET OR IS ADMIN
        if ($ticket->assign_to_user_id !== $authUser->id && !$isCanReturn) {
            throw new AuthorizationException('You can only return tickets assigned to you.');
        }

        return true;
    }

    public function cancel(User $authUser, Ticket $ticket): bool
    {
        // CHECK IF USER HAS PERMISSION TO CANCEL TICKET
        if (! $authUser->hasPermissionTo('update_pending_ticket')) {
            throw new AuthorizationException('You do not have permission to cancel the ticket.');
        }

        // CHECK IF USER IS ASSIGNED TO TICKET OR IS ADMIN
        $userRoles = $authUser->roles->pluck('name');
        $isCanCancel = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        if ($ticket->assign_to_user_id !== $authUser->id && !$isCanCancel) {
            throw new AuthorizationException('You can only cancel tickets assigned to you.');
        }

        // CHECK IF TICKET STATUS ALLOWS CANCELLING
        if (!in_array($ticket->status, ['assigned', 'resubmitted', 're-open', 'follow-up'])) {
            throw new AuthorizationException('Only assigned and resubmitted tickets can be cancelled.');
        }

        return true;
    }

    public function assign(User $authUser, Ticket $ticket): bool
    {
        // CHECK IF USER HAS PERMISSION TO ASSIGN TICKETS
        if (! $authUser->hasPermissionTo('update_pending_ticket')) {
            throw new AuthorizationException('You do not have permission to assign tickets.');
        }

        // CHECK IF USER IS ADMIN OR MANAGER (only admins/managers can assign tickets)
        $userRoles = $authUser->roles->pluck('name');
        $isCanAssign = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager', 'Team Leader']));
        $isSuperAdmin = $userRoles->contains('Super Admin');
        
        if (!$isCanAssign) {
            throw new AuthorizationException('Only administrators and managers can assign tickets.');
        }

        // CHECK IF TICKET STATUS ALLOWS ASSIGNMENT (Super Admin bypasses status restrictions)
        if (!$isSuperAdmin && in_array($ticket->status, ['closed', 'cancelled'])) {
            throw new AuthorizationException('Cannot assign closed or cancelled tickets.');
        }

        return true;
    }

    public function reopen(User $authUser, Ticket $ticket): bool
    {
        // CHECK IF USER HAS PERMISSION TO REOPEN TICKET
        if (! $authUser->hasPermissionTo('update_pending_ticket')) {
            throw new AuthorizationException('You do not have permission to reopen the ticket.');
        }

        // CHECK IF USER IS SUPER ADMIN, ADMIN, OR MANAGER
        $userRoles = $authUser->roles->pluck('name');
        $isCanReopen = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        $isSuperAdmin = $userRoles->contains('Super Admin');
        
        if (!$isCanReopen) {
            throw new AuthorizationException('Only Super Admin, Admin, and Manager can reopen tickets.');
        }

        // CHECK IF TICKET IS CLOSED (Super Admin can reopen any ticket, others only closed tickets)
        if (!$isSuperAdmin && strtolower(trim($ticket->status)) !== 'closed') {
            throw new AuthorizationException('Only closed tickets can be reopened.');
        }

        return true;
    }

    public function remindClient(User $authUser, Ticket $ticket): bool
    {
        // CHECK IF USER HAS PERMISSION TO FOLLOW UP TICKET
        if (! $authUser->hasPermissionTo('update_pending_ticket')) {
            throw new AuthorizationException('You do not have permission to send a reminder to the client about this ticket.');
        }

        // CHECK IF USER IS IN ALLOWED ROLES
        $userRoles = $authUser->roles->pluck('name');
        $isCanFollowUp = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager', 'Team Leader', 'Support Agent']));
        $isSuperAdmin = $userRoles->contains('Super Admin');
        
        if (!$isCanFollowUp) {
            throw new AuthorizationException('Only Super Admin, Admin, Manager, Team Leader, and Support Agent can process client reminder tickets.');
        }

        // CHECK IF TICKET IS RETURNED STATUS (Super Admin can send reminders for any ticket)
        if (!$isSuperAdmin && strtolower(trim($ticket->status)) !== 'returned') {
            throw new AuthorizationException('Only tickets with returned status can be processed for client reminders.');
        }

        return true;
    }

    public function restore(User $authUser, Ticket $ticket): bool
    {
        // CHECK IF USER IS SUPER ADMIN
        $userRoles = $authUser->roles->pluck('name');
        $isSuperAdmin = $userRoles->contains('Super Admin');
        
        if (!$isSuperAdmin) {
            throw new AuthorizationException('Only Super Admin can restore tickets.');
        }
        
        // CHECK IF TICKET IS DELETED
        if (strtolower(trim($ticket->status)) !== 'deleted') {
            throw new AuthorizationException('Only deleted tickets can be restored.');
        }
        
        return true;
    }

    public function followUpByClient(?User $authUser, Ticket $ticket): bool
    {
        if (strtolower(trim($ticket->status)) !== 'assigned') {
            throw new AuthorizationException('Only assigned tickets can be followed up by the client.');
        }
        
        return true;
    }
}

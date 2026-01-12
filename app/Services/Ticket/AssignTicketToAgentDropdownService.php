<?php

namespace App\Services\Ticket;

use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class AssignTicketToAgentDropdownService
{
    use AuthorizesRequests;

    public function assignTicketToAgentDropdown()
    {
        $currentUser = request()->user();

        // CHECK IF CURRENT USER IS SUPER ADMIN, ADMIN, OR MANAGER - THEY CAN SEE ALL USERS
        if ($currentUser->hasAnyRole(['Super Admin', 'Admin', 'Manager'])) {
            $users = User::with('roles')->where('status', 'active')->select(
                'id',
                'uuid',
                'name',
                'email',
            )->get();
        }
        // CHECK IF CURRENT USER IS TEAM LEADER, ONLY SHOW THEIR ASSIGNED SUPPORT AGENTS
        elseif ($currentUser->hasRole('Team Leader')) {
            $users = $currentUser->supportAgents()->with('roles')->where('users.status', 'active')->select(
                'users.id',
                'users.uuid',
                'users.name',
                'users.email',
            )->get();
        }
        // FOR OTHER ROLES, RETURN EMPTY COLLECTION
        else {
            $users = collect();
        }
        
        return $users->map(function ($user) {
            return [
                'id' => $user->id,
                'uuid' => $user->uuid,
                'name' => $user->name,
                'email' => $user->email,
                'avatar_url' => $user->avatar_url,
                'roles' => $user->roles->pluck('name')->toArray(),
            ];
        });
    }
}

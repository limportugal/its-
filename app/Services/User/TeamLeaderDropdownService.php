<?php

namespace App\Services\User;

use Spatie\Permission\Models\Role;
use App\Models\User;

class TeamLeaderDropdownService
{
    public function getTeamLeaderDropdown()
    {
        $currentUser = request()->user();
        
        if (!$currentUser) {
            return collect();
        }

        // ONLY SUPER ADMIN, ADMIN, AND MANAGER CAN VIEW TEAM LEADERS
        if (!$currentUser->hasRole(['Super Admin', 'Admin', 'Manager'])) {
            return collect();
        }

        // GET TEAM LEADER ROLE
        $teamLeaderRole = Role::where('name', 'Team Leader')->first();
        
        if (!$teamLeaderRole) {
            return collect();
        }

        // GET USERS WITH TEAM LEADER ROLE
        $teamLeaders = User::select(
            'id', 
            'uuid',
            'name', 
            'email',
        )->with(['roles' => function ($query) {
            $query->select('id', 'name');
        }])
        ->whereHas('roles', function ($query) use ($teamLeaderRole) {
            $query->where('roles.id', $teamLeaderRole->id);
        })->get();
        
        // If no team leaders found, return all users
        if ($teamLeaders->isEmpty()) {
            $teamLeaders = User::select(
                'id', 
                'uuid',
                'name', 
                'email',
                'avatar_url'
            )->with(['roles' => function ($query) {
                $query->select('id', 'name');
            }])->limit(5)->get();
        }
       
        // FILTER ROLES TO ONLY SHOW ID AND NAME
        $filteredTeamLeaders = $teamLeaders->map(function ($user) {
            return [
                'id' => $user->id,
                'uuid' => $user->uuid,
                'name' => $user->name,
                'email' => $user->email,
                'avatar_url' => $user->avatar_url,
                'roles' => $user->roles->map(function ($role) {
                    return [
                        'id' => $role->id,
                        'name' => $role->name
                    ];
                })
            ];
        });
        return $filteredTeamLeaders;
    }
}

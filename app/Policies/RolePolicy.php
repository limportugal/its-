<?php

namespace App\Policies;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\Access\HandlesAuthorization;

class RolePolicy
{
    use HandlesAuthorization;

    public function view(User $authUser): bool
    {
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin']));
        
        if (!$isAuthorized) {
            throw new AuthorizationException('You do not have permission to view roles.');
        }
        return true;
    }

    public function create(User $authUser): bool
    {
        // CHECK IF USER HAS SUPER ADMIN OR ADMIN ROLE
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin']));
        
        if (!$isAuthorized && !$authUser->hasAnyPermission(['create_role'])) {
            throw new AuthorizationException('You do not have permission to create roles.');
        }
        return true;
    }

    public function update(User $authUser, ?Role $role = null): bool
    {
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin']));
        
        if (!$isAuthorized && !$authUser->hasAnyPermission(['update_role'])) {
            throw new AuthorizationException('You do not have permission to update roles.');
        }
        return true;
    }

    public function delete(User $authUser, Role $role): bool
    {
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin']));
        
        if (!$isAuthorized && !$authUser->hasAnyPermission(['delete_role'])) {
            throw new AuthorizationException('You do not have permission to delete roles.');
        }
        return true;
    }
}

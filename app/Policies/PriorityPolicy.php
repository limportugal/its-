<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Priority;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\Access\HandlesAuthorization;

class PriorityPolicy
{
    use HandlesAuthorization;

    public function create(User $authUser): bool
    {
        // CHECK IF USER HAS SUPER ADMIN OR ADMIN ROLE
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        if (!$isAuthorized && !$authUser->hasAnyPermission(['create_priority'])) {
            throw new AuthorizationException('You do not have permission to create priorities.');
        }
        return true;
    }

    public function update(User $authUser, ?Priority $priority = null): bool
    {
        // CHECK IF USER HAS SUPER ADMIN OR ADMIN ROLE
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        if (!$isAuthorized && !$authUser->hasAnyPermission(['update_priority'])) {
            throw new AuthorizationException('You do not have permission to update priorities.');
        }
        
        // Suppress unused parameter warning
        unset($priority);
        return true;
    }

    public function delete(User $authUser, ?Priority $priority = null): bool
    {
        // CHECK IF USER HAS SUPER ADMIN OR ADMIN ROLE
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        if (!$isAuthorized && !$authUser->hasAnyPermission(['delete_priority'])) {
            throw new AuthorizationException('You do not have permission to delete priorities.');
        }
        
        // Suppress unused parameter warning
        unset($priority);
        return true;
    }

    public function activate(User $authUser, Priority $priority): bool
    {
        // CHECK IF USER HAS SUPER ADMIN OR ADMIN ROLE
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        if (!$isAuthorized && !$authUser->hasAnyPermission(['activate_priority'])) {
            throw new AuthorizationException('You do not have permission to activate priorities.');
        }
        
        unset($priority);
        return true;
    }

    public function inactivate(User $authUser, Priority $priority): bool
    {
        // CHECK IF USER HAS SUPER ADMIN OR ADMIN ROLE
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        if (!$isAuthorized && !$authUser->hasAnyPermission(['inactivate_priority'])) {
            throw new AuthorizationException('You do not have permission to inactivate priorities.');
        }
        
        unset($priority);
        return true;
    }
}

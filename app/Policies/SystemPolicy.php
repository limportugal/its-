<?php

namespace App\Policies;

use App\Models\User;
use App\Models\System;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\Access\HandlesAuthorization;

class SystemPolicy
{
    use HandlesAuthorization;

    public function create(User $authUser): bool
    {
        // CHECK IF USER HAS SUPER ADMIN OR ADMIN ROLE
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        if (!$isAuthorized && !$authUser->hasAnyPermission(['create_system'])) {
            throw new AuthorizationException('You do not have permission to create systems.');
        }
        return true;
    }

    public function update(User $authUser, ?System $system = null): bool
    {
        // CHECK IF USER HAS SUPER ADMIN OR ADMIN ROLE
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        if (!$isAuthorized && !$authUser->hasAnyPermission(['update_system'])) {
            throw new AuthorizationException('You do not have permission to update systems.');
        }
        
        // SUPPRESS UNUSED PARAMETER WARNING
        unset($system);
        return true;
    }

    public function delete(User $authUser, System $system): bool
    {
        // CHECK IF USER HAS SUPER ADMIN OR ADMIN ROLE
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        if (!$isAuthorized && !$authUser->hasAnyPermission(['delete_system'])) {
            throw new AuthorizationException('You do not have permission to delete systems.');
        }
        
        unset($system);
        return true;
    }

    public function activate(User $authUser, System $system): bool
    {
        // CHECK IF USER HAS SUPER ADMIN OR ADMIN ROLE
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        if (!$isAuthorized && !$authUser->hasAnyPermission(['activate_system'])) {
            throw new AuthorizationException('You do not have permission to activate systems.');
        }
        
        unset($system);
        return true;
    }

    public function inactivate(User $authUser, System $system): bool
    {
        // CHECK IF USER HAS SUPER ADMIN OR ADMIN ROLE
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        if (!$isAuthorized && !$authUser->hasAnyPermission(['inactivate_system'])) {
            throw new AuthorizationException('You do not have permission to inactivate systems.');
        }
        
        unset($system);
        return true;
    }
}

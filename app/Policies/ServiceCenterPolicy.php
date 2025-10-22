<?php

namespace App\Policies;

use App\Models\User;
use App\Models\ServiceCenter;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\Access\HandlesAuthorization;

class ServiceCenterPolicy
{
    use HandlesAuthorization;

    public function create(User $authUser): bool
    {
        // CHECK IF USER HAS SUPER ADMIN OR ADMIN ROLE
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        if (!$isAuthorized && !$authUser->hasAnyPermission(['create_service_center'])) {
            throw new AuthorizationException('You do not have permission to create service centers.');
        }
        return true;
    }

    public function update(User $authUser, ?ServiceCenter $serviceCenter = null): bool
    {
        // CHECK IF USER HAS SUPER ADMIN OR ADMIN ROLE
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        if (!$isAuthorized && !$authUser->hasAnyPermission(['update_service_center'])) {
            throw new AuthorizationException('You do not have permission to update service centers.');
        }
        
        // Suppress unused parameter warning
        unset($serviceCenter);
        return true;
    }

    public function delete(User $authUser, ServiceCenter $serviceCenter): bool
    {
        // CHECK IF USER HAS SUPER ADMIN OR ADMIN ROLE
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        if (!$isAuthorized && !$authUser->hasAnyPermission(['delete_service_center'])) {
            throw new AuthorizationException('You do not have permission to delete service centers.');
        }
        
        unset($serviceCenter);
        return true;
    }

    public function activate(User $authUser, ServiceCenter $serviceCenter): bool
    {
        // CHECK IF USER HAS SUPER ADMIN OR ADMIN ROLE
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        if (!$isAuthorized && !$authUser->hasAnyPermission(['activate_service_center'])) {
            throw new AuthorizationException('You do not have permission to activate service centers.');
        }
        
        unset($serviceCenter);
        return true;
    }

    public function inactivate(User $authUser, ServiceCenter $serviceCenter): bool
    {
        // CHECK IF USER HAS SUPER ADMIN OR ADMIN ROLE
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        if (!$isAuthorized && !$authUser->hasAnyPermission(['inactivate_service_center'])) {
            throw new AuthorizationException('You do not have permission to inactivate service centers.');
        }
        
        unset($serviceCenter);
        return true;
    }
}

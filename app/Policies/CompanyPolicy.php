<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Company;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\Access\HandlesAuthorization;

class CompanyPolicy
{
    use HandlesAuthorization;

    public function create(User $authUser): bool
    {
        // CHECK IF USER HAS SUPER ADMIN OR ADMIN ROLE
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        if (!$isAuthorized && !$authUser->hasAnyPermission(['create_company'])) {
            throw new AuthorizationException('You do not have permission to create companies.');
        }
        return true;
    }

    public function update(User $authUser, ?Company $company = null): bool
    {
        // CHECK IF USER HAS SUPER ADMIN OR ADMIN ROLE
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        if (!$isAuthorized && !$authUser->hasAnyPermission(['update_company'])) {
            throw new AuthorizationException('You do not have permission to update companies.');
        }
        
        // Suppress unused parameter warning
        unset($company);
        return true;
    }

    public function delete(User $authUser, Company $company): bool
    {
        // CHECK IF USER HAS SUPER ADMIN OR ADMIN ROLE
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        if (!$isAuthorized && !$authUser->hasAnyPermission(['delete_company'])) {
            throw new AuthorizationException('You do not have permission to delete companies.');
        }
        
        unset($company);
        return true;
    }

    public function activate(User $authUser, Company $company): bool
    {
        // CHECK IF USER HAS SUPER ADMIN OR ADMIN ROLE
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        if (!$isAuthorized && !$authUser->hasAnyPermission(['activate_company'])) {
            throw new AuthorizationException('You do not have permission to activate companies.');
        }
        
        unset($company);
        return true;
    }

    public function inactivate(User $authUser, Company $company): bool
    {
        // CHECK IF USER HAS SUPER ADMIN OR ADMIN ROLE
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        if (!$isAuthorized && !$authUser->hasAnyPermission(['inactivate_company'])) {
            throw new AuthorizationException('You do not have permission to inactivate companies.');
        }
        
        unset($company);
        return true;
    }
}

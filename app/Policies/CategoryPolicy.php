<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Category;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\Access\HandlesAuthorization;

class CategoryPolicy
{
    use HandlesAuthorization;

    public function create(User $authUser): bool
    {
        // CHECK IF USER HAS SUPER ADMIN OR ADMIN ROLE
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        if (!$isAuthorized && !$authUser->hasAnyPermission(['create_category'])) {
            throw new AuthorizationException('You do not have permission to create categories.');
        }
        return true;
    }

    public function update(User $authUser, ?Category $category = null): bool
    {
        // CHECK IF USER HAS SUPER ADMIN OR ADMIN ROLE
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        if (!$isAuthorized && !$authUser->hasAnyPermission(['update_category'])) {
            throw new AuthorizationException('You do not have permission to update categories.');
        }
        
        // Suppress unused parameter warning
        unset($category);
        return true;
    }

    public function delete(User $authUser, Category $category): bool
    {
        // CHECK IF USER HAS SUPER ADMIN OR ADMIN ROLE
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        if (!$isAuthorized && !$authUser->hasAnyPermission(['delete_category'])) {
            throw new AuthorizationException('You do not have permission to delete categories.');
        }
        
        // Suppress unused parameter warning
        unset($category);
        return true;
    }

    public function activate(User $authUser, Category $category): bool
    {
        // CHECK IF USER HAS SUPER ADMIN OR ADMIN ROLE
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        if (!$isAuthorized && !$authUser->hasAnyPermission(['activate_category'])) {
            throw new AuthorizationException('You do not have permission to activate categories.');
        }
        
        unset($category);
        return true;
    }

    public function inactivate(User $authUser, Category $category): bool
    {
        // CHECK IF USER HAS SUPER ADMIN OR ADMIN ROLE
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        if (!$isAuthorized && !$authUser->hasAnyPermission(['inactivate_category'])) {
            throw new AuthorizationException('You do not have permission to inactivate categories.');
        }
        
        unset($category);
        return true;
    }
}

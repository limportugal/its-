<?php

namespace App\Policies;

use App\Models\User;
use Spatie\Permission\Models\Permission;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\Access\HandlesAuthorization;

class PermisionPolicy
{
    use HandlesAuthorization;

    public function create(User $authUser): bool
    {
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin']));
        
        if (!$isAuthorized && !$authUser->hasAnyPermission(['create_permission'])) {
            throw new AuthorizationException('You do not have permission to create permissions.');
        }
        return true;
    }

    public function update(User $authUser, ?Permission $permission = null): bool
    {
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin']));
        
        if (!$isAuthorized && !$authUser->hasAnyPermission(['update_permission'])) {
            throw new AuthorizationException('You do not have permission to update permissions.');
        }
        
        // Suppress unused parameter warning
        unset($permission);
        return true;
    }

    public function delete(User $authUser, ?Permission $permission = null): bool
    {
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin']));
        
        if (!$isAuthorized && !$authUser->hasAnyPermission(['delete_permission'])) {
            throw new AuthorizationException('You do not have permission to delete permissions.');
        }
        
        // Suppress unused parameter warning
        unset($permission);
        return true;
    }
}

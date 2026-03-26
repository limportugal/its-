<?php

namespace App\Policies;

use App\Models\Ownership;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\Access\HandlesAuthorization;

class OwnershipPolicy
{
    use HandlesAuthorization;

    public function create(User $authUser): bool
    {
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));

        if (!$isAuthorized && !$authUser->hasAnyPermission(['create_ownership'])) {
            throw new AuthorizationException('You do not have permission to create ownership records.');
        }

        return true;
    }

    public function update(User $authUser, ?Ownership $ownership = null): bool
    {
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));

        if (!$isAuthorized && !$authUser->hasAnyPermission(['update_ownership'])) {
            throw new AuthorizationException('You do not have permission to update ownership records.');
        }

        unset($ownership);
        return true;
    }
}
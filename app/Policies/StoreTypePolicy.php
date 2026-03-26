<?php

namespace App\Policies;

use App\Models\StoreType;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\Access\HandlesAuthorization;

class StoreTypePolicy
{
    use HandlesAuthorization;

    public function create(User $authUser): bool
    {
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));

        if (!$isAuthorized && !$authUser->hasAnyPermission(['create_store_type'])) {
            throw new AuthorizationException('You do not have permission to create store type records.');
        }

        return true;
    }

    public function update(User $authUser, ?StoreType $storeType = null): bool
    {
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));

        if (!$isAuthorized && !$authUser->hasAnyPermission(['update_store_type'])) {
            throw new AuthorizationException('You do not have permission to update store type records.');
        }

        unset($storeType);
        return true;
    }
}
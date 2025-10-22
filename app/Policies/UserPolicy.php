<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    public function create(User $authUser): bool
    {
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));

        // THROW AUTHORIZATION EXCEPTION IF USER DOES NOT HAVE PERMISSION TO CREATE USER
        if (!$isAuthorized && !$authUser->hasAnyPermission(['create_user'])) {
            throw new AuthorizationException('You do not have permission to create user.');
        }

        return true;
    }

    public function update(User $authUser, User $user): bool
    {
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        // THROW AUTHORIZATION EXCEPTION IF USER DOES NOT HAVE PERMISSION TO UPDATE USER
        if (!$isAuthorized && !$authUser->hasAnyPermission(['update_user'])) {
            throw new AuthorizationException('You do not have permission to update user.');
        }

        return true;
    }

    public function delete(User $authUser, User $user): bool
    {
        // PREVENT USER FROM DELETING THEIR OWN ACCOUNT
        if ($authUser->id === $user->id) {
            throw new AuthorizationException('You cannot delete your own account.');
        }

        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin']));
        
        // THROW AUTHORIZATION EXCEPTION IF USER DOES NOT HAVE PERMISSION TO DELETE USER
        if (!$isAuthorized && !$authUser->hasAnyPermission(['delete_user'])) {
            throw new AuthorizationException('You do not have permission to delete user.');
        }
        return true;
    }

    public function activate(User $authUser): bool
    {
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        // THROW AUTHORIZATION EXCEPTION IF USER DOES NOT HAVE PERMISSION TO ACTIVATE USER
        if (!$isAuthorized && !$authUser->hasAnyPermission(['update_user'])) {
            throw new AuthorizationException('You do not have permission to activate user.');
        }

        return true;
    }
    
    public function deactivate(User $authUser): bool
    {
        $userRoles = $authUser->roles->pluck('name');
        $isAuthorized = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        
        // THROW AUTHORIZATION EXCEPTION IF USER DOES NOT HAVE PERMISSION TO DEACTIVATE USER
        if (!$isAuthorized && !$authUser->hasAnyPermission(['update_user'])) {
            throw new AuthorizationException('You do not have permission to deactivate user.');
        }

        return true;
    }   

    public function changePassword(User $authUser, User $user): bool
    {
        // A USER CAN ALWAYS CHANGE THEIR OWN PASSWORD.
        if ($authUser->uuid === $user->uuid) {
            return true;
        }

        // ONLY SUPER ADMIN CAN CHANGE ANOTHER USER'S PASSWORD.
        if ($authUser->hasRole('Super Admin')) {
            return true;
        }

        // DENY ALL OTHER ATTEMPTS.
        throw new AuthorizationException("You do not have permission to change {$user->full_name}'s password.");
    }

    public function updateUserPasswordByUuid(User $authUser, User $user): bool
    {
        // ONLY SUPER ADMIN CAN CHANGE ANOTHER USER'S PASSWORD.
        if ($authUser->hasRole('Super Admin')) {
            return true;
        }

        // DENY ALL OTHER ATTEMPTS.
        throw new AuthorizationException("You do not have permission to change {$user->full_name}'s password.");
    }
}

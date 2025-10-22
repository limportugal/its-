<?php

namespace App\Services\User;

use Spatie\Permission\Models\Role;

class GetUpdateUserRoleDropdownService
{
    public function getUserRoleDropdown()
    {
        $currentUser = request()->user();
        
        if (!$currentUser) {
            return collect();
        }

        // SUPER ADMIN CAN SEE ALL ROLES
        if ($currentUser->hasRole('Super Admin')) {
            return Role::select('id', 'name')->get();
        }

        // ADMIN CANNOT SEE SUPER ADMIN, ADMIN, AND MANAGER ROLES
        if ($currentUser->hasRole('Admin')) {
            return Role::select('id', 'name')
                ->whereNotIn('name', ['Super Admin', 'Manager'])
                ->get();
        }

        // MANAGER CANNOT SEE SUPER ADMIN ROLE
        if ($currentUser->hasRole('Manager')) {
            return Role::select('id', 'name')
                ->whereNotIn('name', ['Super Admin'])
                ->get();
        }
        
        return Role::select('id', 'name')->get();
    }
}

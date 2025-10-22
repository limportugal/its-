<?php

namespace App\Services\RBAC\Permission;

use Spatie\Permission\Models\Permission;

class ShowPermissionsService
{
    public function getPermissions()
    {
        return Permission::with('roles:id,name')
            ->orderBy('created_at', 'desc')
            ->get();
    }
}

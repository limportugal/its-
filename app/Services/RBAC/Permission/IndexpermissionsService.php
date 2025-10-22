<?php

namespace App\Services\RBAC\Permission;

class IndexpermissionsService
{
    public function getUserPermissions()
    {
        $user = request()->user();
        return $user->getAllPermissions()->pluck('name')->toArray();
    }
}

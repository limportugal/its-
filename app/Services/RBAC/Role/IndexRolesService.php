<?php

namespace App\Services\RBAC\Role;

use App\Models\UserLogs;
use Spatie\Permission\Models\Role;

class IndexRolesService
{
    public function index()
    {
        $user = request()->user();
        $permissions = $user->getAllPermissions()->pluck('name')->toArray();
        
        return [
            'userPermissions' => $permissions
        ];
    }
}

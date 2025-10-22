<?php

namespace App\Services\User;

use App\Models\User;
class IndexUserService
{
    public function __construct(
        protected User $user
    ) {}

    public function index(): array
    {
        $user = request()->user();
        $permissions = $user->getAllPermissions()->pluck('name')->toArray();
        $roles = $user->roles->pluck('name')->toArray();
        
        return [
            'userRoles' => $roles,
            'userPermissions' => $permissions,
        ];
    }
}

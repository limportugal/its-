<?php

namespace App\Services\RBAC\Role;

use Spatie\Permission\Models\Role;

class ShowRolesService
{
    public function show()
    {
        $roles = Role::select('id', 'name', 'description', 'created_at')
            ->orderByRaw("CASE 
                WHEN name = 'Super Admin' THEN 1
                WHEN name = 'Admin' THEN 2
                WHEN name = 'Manager' THEN 3
                WHEN name = 'Team Leader' THEN 4
                WHEN name = 'Support Agent' THEN 5
                ELSE 6
            END")
            ->get();
        
        return $roles;
    }
}

<?php

namespace App\Services\RBAC\Role;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\UserLogs;
use Illuminate\Support\Facades\DB;

class StoreRoleService
{
    public function store($request): array
    {
        return DB::transaction(function () use ($request) {
            // FORMAT THE INCOMING PERMISSIONS TO MATCH THE DATABASE FORMAT
            $formattedPermissions = array_map(function ($permission) {
                return strtolower(str_replace(' ', '_', $permission));
            }, $request->permissions ?? []);

            // MERGE THE FORMATTED PERMISSIONS WITH THE REQUEST
            $request->merge(['permissions' => $formattedPermissions]);

            // CREATE THE PERMISSIONS IF THEY DON'T EXIST
            if (!empty($formattedPermissions)) {
                foreach ($formattedPermissions as $permission) {
                    Permission::firstOrCreate(['name' => $permission]);
                }
            }

            // CREATE THE ROLE
            $role = Role::create([
                'name' => $request->name,
                'description' => $request->description,
            ]);

            // SYNC THE PERMISSIONS
            if ($request->has('permissions')) {
                $role->syncPermissions($request->permissions);
            }

            // LOG THE ACTIVITY
            UserLogs::logActivity("Role ({$role->name}) created with permissions.");

            return [
                'message' => 'Role created successfully!',
                'role' => $role->load('permissions')
            ];
        });
    }
}

<?php

namespace App\Services\RBAC\Role;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\UserLogs;
use Illuminate\Support\Facades\DB;

class UpdateRoleService
{
    
    public function __construct(
        protected Role $updateRole,
        protected UserLogs $userLogs
    ) {}

    public function update(int $id, array $data): array
    {
        return DB::transaction(function () use ($id, $data) {
            $role = Role::findOrFail($id);
            $originalData = $role->only(['name', 'description']);
            $dataToUpdate = [
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
            ];

            // APPLY NEW DATA TO MODEL
            $role->fill($dataToUpdate);

            // UPDATE PERMISSIONS USING SPATIE
            $permissionNames = $data['permissions'] ?? [];
            
            // Transform permission names to IDs
            $updatedPermissions = Permission::whereIn('name', $permissionNames)->pluck('id')->toArray();
            
            $hasPermissionChanges = $role->permissions->pluck('id')->toArray() !== $updatedPermissions;

            // CHECK IF ANY DATA CHANGED
            if ($role->isDirty() || $hasPermissionChanges) {
                $role->save();
                $role->syncPermissions($updatedPermissions);

                // LOG CHANGES
                $changes = collect($dataToUpdate)
                    ->filter(fn($value, $key) => $originalData[$key] !== $value)
                    ->map(fn($newValue, $field) => "from '{$originalData[$field]}' to '{$newValue}'")
                    ->implode(', ');

                if ($changes) {
                    UserLogs::logActivity("Role '{$role->name}' updated: {$changes}.");
                }

                if (!empty($permissionNames)) {
                    UserLogs::logActivity("Permissions updated for role '{$role->name}': " . implode(', ', $permissionNames));
                } else {
                    UserLogs::logActivity("All permissions removed from role '{$role->name}'.");
                }

                return [
                    'success' => true,
                    'message' => 'Role updated successfully!',
                    'role' => $role->load('permissions')
                ];
            } else {
                return [
                    'success' => true,
                    'message' => 'Nothing to update.',
                    'role' => $role->load('permissions')
                ];
            }
        });
    }
}

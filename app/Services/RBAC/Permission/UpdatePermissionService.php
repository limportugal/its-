<?php

namespace App\Services\RBAC\Permission;

use Spatie\Permission\Models\Permission;
use App\Models\UserLogs;
use Illuminate\Support\Facades\DB;

class UpdatePermissionService
{
    public function __construct(
        protected Permission $updatePermission,
        protected UserLogs $userLogs
    ) {}

    public function update(int $id, array $data): array
    {
        return DB::transaction(function () use ($id, $data) {
            $updatePermission = $this->updatePermission->findOrFail($id);
            
            // DEFINE ALLOWED FIELDS FOR PERMISSION UPDATES
            $allowedFields = ['name'];
            $dataToUpdate = array_intersect_key($data, array_flip($allowedFields));
            $originalData = $updatePermission->only($allowedFields);

            // CHECK IF THERE ARE CHANGES
            $changes = [];
            foreach ($dataToUpdate as $field => $newValue) {
                if ($newValue != $originalData[$field]) {
                    $changes[$field] = [
                        'from' => $originalData[$field] ?? 'null',
                        'to' => $newValue ?? 'null',
                    ];
                }
            }

            // UPDATE THE PERMISSION RECORD
            if (!empty($changes)) {
                $updatePermission->update($dataToUpdate);

                // FORMAT CHANGE DESCRIPTION
                $changeDescriptions = array_map(function ($change) {
                    return " from '{$change['from']}' to '{$change['to']}'";
                }, $changes, array_keys($changes));

                // LOG THE CHANGES
                $this->userLogs->logActivity("Permission name updated: " . implode(', ', $changeDescriptions) . ".");
            }

            return [
                'success' => true,
                'message' => 'Permission updated successfully',
                'data' => $updatePermission
            ];
        });
    }
}

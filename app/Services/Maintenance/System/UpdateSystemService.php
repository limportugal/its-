<?php

namespace App\Services\Maintenance\System;

use App\Models\System;
use App\Models\UserLogs;
use Illuminate\Support\Facades\DB;

class UpdateSystemService
{
    public function __construct(
        protected System $updateSystem,
        protected UserLogs $userLogs
    ) {}

    public function update(int $id, array $data): array
    {
        return DB::transaction(function () use ($id, $data) {
            $updateSystem = $this->updateSystem->findOrFail($id);
            $originalData = $updateSystem->only($updateSystem->getFillable());
            $dataToUpdate = array_intersect_key($data, array_flip($updateSystem->getFillable()));

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

            // UPDATE THE SYSTEM RECORD
            if (!empty($changes)) {
                $updateSystem->update($dataToUpdate);

                // FORMAT CHANGE DESCRIPTION
                $changeDescriptions = array_map(function ($change) {
                    return " from '{$change['from']}' to '{$change['to']}'";
                }, $changes, array_keys($changes));

                // LOG THE CHANGES
                $this->userLogs->logActivity("System name updated: " . implode(', ', $changeDescriptions) . ".");
            }

            return [
                'success' => true,
                'message' => 'System updated successfully',
                'data' => $updateSystem
            ];
        });
    }
}

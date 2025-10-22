<?php

namespace App\Services\Maintenance\Priority;

use App\Models\Priority;
use App\Models\UserLogs;
use Illuminate\Support\Facades\DB;

class UpdatePriorityService
{
    public function __construct(
        protected Priority $priority,
        protected UserLogs $userLogs
    ) {}

    public function update(int $id, array $data): array
    {
        return DB::transaction(function () use ($id, $data) {
            $priority = $this->priority->findOrFail($id);
            $originalData = $priority->only($priority->getFillable());
            $dataToUpdate = array_intersect_key($data, array_flip($priority->getFillable()));

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

            // UPDATE THE PRIORITY RECORD
            if (!empty($changes)) {
                $priority->update($dataToUpdate);

                // FORMAT CHANGE DESCRIPTION
                $changeDescriptions = array_map(function ($change) {
                    return " from '{$change['from']}' to '{$change['to']}'";
                }, $changes, array_keys($changes));

                // LOG THE CHANGES
                $this->userLogs->logActivity("Priority name updated: " . implode(', ', $changeDescriptions) . ".");
            }

            return [
                'success' => true,
                'message' => 'Priority updated successfully',
                'data' => $priority
            ];
        });
    }
}

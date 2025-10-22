<?php

namespace App\Services\Maintenance\ServiceCenter;

use App\Models\ServiceCenter;
use App\Models\UserLogs;
use Illuminate\Support\Facades\DB;

class UpdateServiceCenterService
{
    public function __construct(
        protected ServiceCenter $updateServiceCenter,
        protected UserLogs $userLogs
    ) {}

    public function update(int $id, array $data): array
    {
        return DB::transaction(function () use ($id, $data) {
            $updateServiceCenter = $this->updateServiceCenter->findOrFail($id);
            $originalData = $updateServiceCenter->only($updateServiceCenter->getFillable());
            $dataToUpdate = array_intersect_key($data, array_flip($updateServiceCenter->getFillable()));

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

            // UPDATE THE COMPANY RECORD
            if (!empty($changes)) {
                $updateServiceCenter->update($dataToUpdate);

                // FORMAT CHANGE DESCRIPTION
                $changeDescriptions = array_map(function ($change) {
                    return " from '{$change['from']}' to '{$change['to']}'";
                }, $changes, array_keys($changes));

                // LOG THE CHANGES
                $this->userLogs->logActivity("Service Center name updated: " . implode(', ', $changeDescriptions) . ".");
            }

            return [
                'success' => true,
                'message' => 'Service Center updated successfully',
                'data' => $updateServiceCenter
            ];
        });
    }
}

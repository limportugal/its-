<?php

namespace App\Services\Maintenance\Category;

use App\Models\Category;
use App\Models\UserLogs;
use Illuminate\Support\Facades\DB;

class UpdateCategoryService
{
    public function __construct(
        protected Category $updateCategory,
        protected UserLogs $userLogs
    ) {}

    public function update(int $id, array $data): array
    {
        return DB::transaction(function () use ($id, $data) {
            $updateCategory = $this->updateCategory->findOrFail($id);
            $originalData = $updateCategory->only($updateCategory->getFillable());
            $dataToUpdate = array_intersect_key($data, array_flip($updateCategory->getFillable()));

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

            // UPDATE THE CATEGORY RECORD
            if (!empty($changes)) {
                $updateCategory->update($dataToUpdate);

                // FORMAT CHANGE DESCRIPTION
                $changeDescriptions = array_map(function ($change) {
                    return " from '{$change['from']}' to '{$change['to']}'";
                }, $changes, array_keys($changes));

                // LOG THE CHANGES
                $this->userLogs->logActivity("Category updated: " . implode(', ', $changeDescriptions) . ".");
            }

            return [
                'success' => true,
                'message' => 'Category updated successfully',
                'data' => $updateCategory
            ];
        });
    }
}

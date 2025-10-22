<?php

namespace App\Services\Maintenance\Company;

use App\Models\Company;
use App\Models\UserLogs;
use Illuminate\Support\Facades\DB;

class UpdateCompanyService
{
    public function __construct(
        protected Company $updateCompany,
        protected UserLogs $userLogs
    ) {}

    public function update(int $id, array $data): array
    {
        return DB::transaction(function () use ($id, $data) {
            $updateCompany = $this->updateCompany->findOrFail($id);
            $originalData = $updateCompany->only($updateCompany->getFillable());
            $dataToUpdate = array_intersect_key($data, array_flip($updateCompany->getFillable()));

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
                $updateCompany->update($dataToUpdate);

                // FORMAT CHANGE DESCRIPTION
                $changeDescriptions = array_map(function ($change) {
                    return " from '{$change['from']}' to '{$change['to']}'";
                }, $changes, array_keys($changes));

                // LOG THE CHANGES
                $this->userLogs->logActivity("Company name updated: " . implode(', ', $changeDescriptions) . ".");
            }

            return [
                'success' => true,
                'message' => 'Company updated successfully',
                'data' => $updateCompany
            ];
        });
    }
}

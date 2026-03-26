<?php

namespace App\Services\Maintenance\Ownership;

use App\Models\Ownership;
use App\Models\UserLogs;
use Illuminate\Support\Facades\DB;

class UpdateOwnershipService
{
    public function __construct(
        protected Ownership $ownership,
        protected UserLogs $userLogs
    ) {}

    public function update(int $id, array $data): array
    {
        return DB::transaction(function () use ($id, $data) {
            $record = $this->ownership->findOrFail($id);
            $original = $record->ownership_name;

            if ($original === $data['ownership_name']) {
                return [
                    'success' => false,
                    'message' => 'No changes detected.',
                    'data' => $record,
                ];
            }

            $record->update(['ownership_name' => $data['ownership_name']]);
            $this->userLogs->logActivity("Ownership updated from '{$original}' to '{$record->ownership_name}'.");

            return [
                'success' => true,
                'message' => 'Ownership updated successfully',
                'data' => $record,
            ];
        });
    }
}
<?php

namespace App\Services\Maintenance\StoreType;

use App\Models\StoreType;
use App\Models\UserLogs;
use Illuminate\Support\Facades\DB;

class UpdateStoreTypeService
{
    public function __construct(
        protected StoreType $storeType,
        protected UserLogs $userLogs
    ) {}

    public function update(int $id, array $data): array
    {
        return DB::transaction(function () use ($id, $data) {
            $record = $this->storeType->findOrFail($id);
            $original = $record->store_type_name;

            if ($original === $data['store_type_name']) {
                return [
                    'success' => false,
                    'message' => 'No changes detected.',
                    'data' => $record,
                ];
            }

            $record->update(['store_type_name' => $data['store_type_name']]);
            $this->userLogs->logActivity("Store type updated from '{$original}' to '{$record->store_type_name}'.");

            return [
                'success' => true,
                'message' => 'Store type updated successfully',
                'data' => $record,
            ];
        });
    }
}
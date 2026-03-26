<?php

namespace App\Services\Maintenance\StoreType;

use App\Models\StoreType;
use App\Models\UserLogs;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class DeleteStoreTypeService
{
    use AuthorizesRequests;

    public function __construct(
        protected StoreType $storeType,
        protected UserLogs $userLogs
    ) {}

    public function delete($id): array
    {
        $record = $this->storeType->find($id);

        if (!$record) {
            return [
                'success' => false,
                'message' => 'Store type not found.',
                'status' => 404,
            ];
        }

        $this->authorize('update', $record);
        $record->update(['status' => 'deleted']);
        $this->userLogs->logActivity('Store type (' . $record->store_type_name . ') deleted successfully.');

        return [
            'success' => true,
            'message' => 'Store type deleted successfully',
        ];
    }
}

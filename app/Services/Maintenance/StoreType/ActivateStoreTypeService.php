<?php

namespace App\Services\Maintenance\StoreType;

use App\Models\StoreType;
use App\Models\UserLogs;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ActivateStoreTypeService
{
    use AuthorizesRequests;

    public function __construct(
        protected StoreType $storeType,
        protected UserLogs $userLogs
    ) {}

    public function activate($id): array
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
        $record->update(['status' => 'active']);
        $this->userLogs->logActivity('Store type (' . $record->store_type_name . ') activated successfully.');

        return [
            'success' => true,
            'message' => 'Store type activated successfully',
        ];
    }
}

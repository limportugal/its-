<?php

namespace App\Services\Maintenance\Ownership;

use App\Models\Ownership;
use App\Models\UserLogs;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class InactivateOwnershipService
{
    use AuthorizesRequests;

    public function __construct(
        protected Ownership $ownership,
        protected UserLogs $userLogs
    ) {}

    public function inactivate($id): array
    {
        $record = $this->ownership->find($id);

        if (!$record) {
            return [
                'success' => false,
                'message' => 'Ownership not found.',
                'status' => 404,
            ];
        }

        $this->authorize('update', $record);
        $record->update(['status' => 'inactive']);
        $this->userLogs->logActivity('Ownership (' . $record->ownership_name . ') inactivated successfully.');

        return [
            'success' => true,
            'message' => 'Ownership inactivated successfully',
        ];
    }
}

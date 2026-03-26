<?php

namespace App\Services\Maintenance\Ownership;

use App\Models\Ownership;
use App\Models\UserLogs;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class DeleteOwnershipService
{
    use AuthorizesRequests;

    public function __construct(
        protected Ownership $ownership,
        protected UserLogs $userLogs
    ) {}

    public function delete($id): array
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
        $record->update(['status' => 'deleted']);
        $this->userLogs->logActivity('Ownership (' . $record->ownership_name . ') deleted successfully.');

        return [
            'success' => true,
            'message' => 'Ownership deleted successfully',
        ];
    }
}

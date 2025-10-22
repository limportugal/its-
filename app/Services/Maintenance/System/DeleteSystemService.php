<?php

namespace App\Services\Maintenance\System;

use App\Models\System;
use App\Models\UserLogs;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class DeleteSystemService
{
    use AuthorizesRequests;

    public function __construct(
        protected System $system,
        protected UserLogs $userLogs
    ) {}

    public function delete($id)
    {
        $system = $this->system->find($id);
        if (!$system) {
            return [
                'success' => false,
                'message' => 'System not found.',
                'status' => 404
            ];
        }
        
        $this->authorize('delete', $system);
        $system->update(['status' => 'deleted']);
        $this->userLogs->logActivity("System name ({$system->system_name}) deleted successfully.");
        
        return [
            'success' => true,
            'message' => 'System deleted successfully'
        ];
    }
}

<?php

namespace App\Services\Maintenance\System;

use App\Models\System;
use App\Models\UserLogs;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ActivateSystemService
{
    use AuthorizesRequests;

    public function __construct(
        protected System $system,
        protected UserLogs $userLogs
    ) {}

    public function activate($id)
    {
        $system = $this->system->find($id);
        if (!$system) {
            return [
                'success' => false,
                'message' => 'System not found.',
                'status' => 404
            ];
        }
        
        $this->authorize('activate', $system);
        $system->update(['status' => 'active']);
        $this->userLogs->logActivity("System name ({$system->system_name}) activated successfully.");
        
        return [
            'success' => true,
            'message' => 'System activated successfully'
        ];
    }
}

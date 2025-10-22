<?php

namespace App\Services\Maintenance\System;

use App\Models\System;
use App\Models\UserLogs;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class InactivateSystemService
{
    use AuthorizesRequests;

    public function __construct(
        protected System $system,
        protected UserLogs $userLogs
    ) {}

    public function inactivate($id)
    {
        $system = $this->system->find($id);
        if (!$system) {
            return [
                'success' => false,
                'message' => 'System not found.',
                'status' => 404
            ];
        }
        
        $this->authorize('inactivate', $system);
        $system->update(['status' => 'inactive']);
        $this->userLogs->logActivity("System name ({$system->system_name}) inactivated successfully.");
        
        return [
            'success' => true,
            'message' => 'System inactivated successfully'
        ];
    }
}

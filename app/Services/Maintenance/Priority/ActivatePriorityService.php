<?php

namespace App\Services\Maintenance\Priority;

use App\Models\Priority;
use App\Models\UserLogs;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ActivatePriorityService
{
    use AuthorizesRequests;

    public function __construct(
        protected Priority $priority,
        protected UserLogs $userLogs
    ) {}

    public function activate($id)
    {
        $priority = $this->priority->find($id);
        if (!$priority) {
            return [
                'success' => false,
                'message' => 'Priority not found.',
                'status' => 404
            ];
        }
        
        $this->authorize('activate', $priority);
        $priority->update(['status' => 'active']);
        $this->userLogs->logActivity("Priority name ({$priority->priority_name}) activated successfully.");
        
        return [
            'success' => true,
            'message' => 'Priority activated successfully'
        ];
    }
}

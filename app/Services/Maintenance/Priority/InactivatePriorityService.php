<?php

namespace App\Services\Maintenance\Priority;

use App\Models\Priority;
use App\Models\UserLogs;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class InactivatePriorityService
{
    use AuthorizesRequests;

    public function __construct(
        protected Priority $priority,
        protected UserLogs $userLogs
    ) {}

    public function inactivate($id)
    {
        $priority = $this->priority->find($id);
        if (!$priority) {
            return [
                'success' => false,
                'message' => 'Priority not found.',
                'status' => 404
            ];
        }
        
        $this->authorize('inactivate', $priority);
        $priority->update(['status' => 'inactive']);
        $this->userLogs->logActivity("Priority name ({$priority->priority_name}) inactivated successfully.");
        
        return [
            'success' => true,
            'message' => 'Priority inactivated successfully'
        ];
    }
}

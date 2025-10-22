<?php

namespace App\Services\Maintenance\Priority;

use App\Models\Priority;
use App\Models\UserLogs;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class DeletePriorityService
{
    use AuthorizesRequests;

    public function __construct(
        protected Priority $priority,
        protected UserLogs $userLogs
    ) {}

    public function delete($id)
    {
        $priority = $this->priority->find($id);
        if (!$priority) {
            return [
                'success' => false,
                'message' => 'Priority not found.',
                'status' => 404
            ];
        }
        
        $this->authorize('delete', $priority);
        $priority->update(['status' => 'deleted']);
        $this->userLogs->logActivity("Priority name ({$priority->priority_name}) deleted successfully.");
        
        return [
            'success' => true,
            'message' => 'Priority deleted successfully'
        ];
    }
}

<?php

namespace App\Services\Maintenance\ServiceCenter;

use App\Models\ServiceCenter;
use App\Models\UserLogs;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class DeleteServiceCenterService
{
    use AuthorizesRequests;

    public function __construct(
        protected ServiceCenter $serviceCenter,
        protected UserLogs $userLogs
    ) {}

    public function delete($id)
    {
        $serviceCenter = $this->serviceCenter->find($id);
        if (!$serviceCenter) {
            return [
                'success' => false,
                'message' => 'Service Center not found.',
                'status' => 404
            ];
        }
        
        $this->authorize('delete', $serviceCenter);
        $serviceCenter->update(['status' => 'deleted']);
        $this->userLogs->logActivity("Service Center name ({$serviceCenter->service_center_name}) deleted successfully.");
        
        return [
            'success' => true,
            'message' => 'Service Center deleted successfully'
        ];
    }
}

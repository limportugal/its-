<?php

namespace App\Services\Maintenance\ServiceCenter;

use App\Models\ServiceCenter;
use App\Models\UserLogs;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ActivateServiceCenterService
{
    use AuthorizesRequests;

    public function __construct(
        protected ServiceCenter $serviceCenter,
        protected UserLogs $userLogs
    ) {}

    public function activate($id)
    {
        $serviceCenter = $this->serviceCenter->find($id);
        if (!$serviceCenter) {
            return [
                'success' => false,
                'message' => 'Service Center not found.',
                'status' => 404
            ];
        }
        
        $this->authorize('activate', $serviceCenter);
        $serviceCenter->update(['status' => 'active']);
        $this->userLogs->logActivity("Service Center name ({$serviceCenter->service_center_name}) activated successfully.");
        
        return [
            'success' => true,
            'message' => 'Service Center activated successfully'
        ];
    }
}

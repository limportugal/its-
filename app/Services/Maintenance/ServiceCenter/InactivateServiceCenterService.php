<?php

namespace App\Services\Maintenance\ServiceCenter;

use App\Models\ServiceCenter;
use App\Models\UserLogs;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class InactivateServiceCenterService
{
    use AuthorizesRequests;

    public function __construct(
        protected ServiceCenter $serviceCenter,
        protected UserLogs $userLogs
    ) {}

    public function inactivate($id)
    {
        $serviceCenter = $this->serviceCenter->find($id);
        if (!$serviceCenter) {
            return [
                'success' => false,
                'message' => 'Service Center not found.',
                'status' => 404
            ];
        }
        
        $this->authorize('inactivate', $serviceCenter);
        $serviceCenter->update(['status' => 'inactive']);
        $this->userLogs->logActivity("Service Center name ({$serviceCenter->service_center_name}) inactivated successfully.");
        
        return [
            'success' => true,
            'message' => 'Service Center inactivated successfully'
        ];
    }
}

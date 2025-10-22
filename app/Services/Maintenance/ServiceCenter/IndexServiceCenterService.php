<?php

namespace App\Services\Maintenance\ServiceCenter;

use Inertia\Inertia;

class IndexServiceCenterService
{
    public function getIndexData()
    {
        $user = request()->user();
        $permissions = $user->getAllPermissions()->pluck('name')->toArray();
        
        return Inertia::render('Maintenance/MaintenanceNavTabs', [
            'userPermissions' => $permissions
        ]);
    }
}

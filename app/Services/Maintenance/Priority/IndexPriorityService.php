<?php

namespace App\Services\Maintenance\Priority;

use Inertia\Inertia;

class IndexPriorityService
{
    public function getIndexData()
    {
        $user = request()->user();
        $permissions = $user->getAllPermissions()->pluck('name')->toArray();
        
        return Inertia::render('Maintenance/MaintenanceNavTabs', [
            'userRoles' => $user->roles->pluck('name'),
            'userPermissions' => $permissions, 
        ]);
    }
}

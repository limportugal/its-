<?php

namespace App\Services\Maintenance\System;

use Inertia\Inertia;

class IndexSystemService
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

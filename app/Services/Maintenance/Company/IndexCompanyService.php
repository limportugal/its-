<?php

namespace App\Services\Maintenance\Company;

use Inertia\Inertia;

class IndexCompanyService
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

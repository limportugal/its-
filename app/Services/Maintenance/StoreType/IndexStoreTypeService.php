<?php

namespace App\Services\Maintenance\StoreType;

use Inertia\Inertia;

class IndexStoreTypeService
{
    public function getIndexData()
    {
        $user = request()->user();
        $permissions = $user->getAllPermissions()->pluck('name')->toArray();

        return Inertia::render('Maintenance/MaintenanceNavTabs', [
            'userPermissions' => $permissions,
        ]);
    }
}
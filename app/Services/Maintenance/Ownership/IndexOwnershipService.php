<?php

namespace App\Services\Maintenance\Ownership;

use Inertia\Inertia;

class IndexOwnershipService
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
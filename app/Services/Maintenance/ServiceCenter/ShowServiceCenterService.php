<?php

namespace App\Services\Maintenance\ServiceCenter;

use App\Models\ServiceCenter;

class ShowServiceCenterService
{
    public function getServiceCenters()
    {
        return ServiceCenter::select(
            'id', 
            'service_center_name', 
            'created_at',
            'status'
            )
            ->latest()
            ->notDeleted()
            ->get();
    }
}

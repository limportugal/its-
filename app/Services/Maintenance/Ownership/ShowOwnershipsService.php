<?php

namespace App\Services\Maintenance\Ownership;

use App\Models\Ownership;

class ShowOwnershipsService
{
    public function getOwnerships()
    {
        return Ownership::select('id', 'ownership_name', 'created_at', 'status')
            ->latest()
            ->notDeleted()
            ->get();
    }
}
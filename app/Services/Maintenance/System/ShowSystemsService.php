<?php

namespace App\Services\Maintenance\System;

use App\Models\System;

class ShowSystemsService
{
    public function getSystems()
    {
        return System::select(
            'id', 
            'uuid',
            'system_name', 
            'created_at',
            'status'
            )
            ->with(['category' => function($query) {
                $query->select('id', 'system_id', 'category_name', 'created_at');
            }])
            ->notDeleted()
            ->latest()
            ->get();
    }
}

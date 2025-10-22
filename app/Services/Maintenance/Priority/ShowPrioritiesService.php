<?php

namespace App\Services\Maintenance\Priority;

use App\Models\Priority;

class ShowPrioritiesService
{
    public function getPriorities()
    {
        return Priority::select(
            'id', 
            'priority_name', 
            'description', 
            'created_at',
            'status'
            )
            ->latest()
            ->notDeleted()
            ->get();
    }
}

<?php

namespace App\Services\Maintenance\Category;

use App\Models\Category;

class ShowCategoriesService
{
    public function getCategories()
    {
        return Category::select(
            'id', 
            'uuid',
            'category_name', 
            'system_id',
            'created_at',
            'status'
            )
            ->with(['system' => function($query) {
                $query->select('id', 'system_name');
            }])
            ->notDeleted()
            ->latest()
            ->get();
    }
}

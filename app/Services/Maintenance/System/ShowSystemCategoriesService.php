<?php

namespace App\Services\Maintenance\System;

use App\Models\Category;
use App\Models\System;

class ShowSystemCategoriesService
{
    public function getSystemCategories($systemUuid)
    {
        // GET SYSTEM ID BY UUID
        $systemId = System::getIdByUuid($systemUuid);
        
        //  IF SYSTEM ID IS NOT FOUND, RETURN EMPTY COLLECTION
        if (!$systemId) {
            return collect([]); 
        }

        return Category::select(
            'id', 
            'category_name', 
            'status',
            'created_at'
        )
        ->where('system_id', $systemId)
        ->notDeleted()
        ->latest()
        ->get();
    }
}

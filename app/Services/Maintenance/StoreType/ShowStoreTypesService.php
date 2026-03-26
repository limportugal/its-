<?php

namespace App\Services\Maintenance\StoreType;

use App\Models\StoreType;

class ShowStoreTypesService
{
    public function getStoreTypes()
    {
        return StoreType::select('id', 'store_type_name', 'created_at', 'status')
            ->latest()
            ->notDeleted()
            ->get();
    }
}
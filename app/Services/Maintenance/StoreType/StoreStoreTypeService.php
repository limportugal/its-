<?php

namespace App\Services\Maintenance\StoreType;

use App\Models\StoreType;
use App\Models\UserLogs;
use Illuminate\Support\Facades\DB;

class StoreStoreTypeService
{
    public function __construct(
        protected StoreType $storeType,
        protected UserLogs $userLogs
    ) {}

    public function create(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $created = $this->storeType->create($data);
            $this->userLogs->logActivity("Store type '{$created->store_type_name}' created successfully.");

            return [
                'success' => true,
                'message' => 'Store type created successfully',
                'data' => $created,
            ];
        });
    }
}
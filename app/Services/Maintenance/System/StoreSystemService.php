<?php

namespace App\Services\Maintenance\System;

use App\Models\System;
use App\Models\UserLogs;
use Illuminate\Support\Facades\DB;

class StoreSystemService
{
    public function __construct(
        protected System $storeSystem,
        protected UserLogs $userLogs
    ) {}

    public function create(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $storeSystem = $this->storeSystem->create($data);
            $this->userLogs->logActivity("System '{$storeSystem->system_name}' created successfully.");

            return [
                'success' => true,
                'message' => 'System created successfully',
                'data' => $storeSystem
            ];
        });
    }

}

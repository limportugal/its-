<?php

namespace App\Services\Maintenance\ServiceCenter;

use App\Models\ServiceCenter;
use App\Models\UserLogs;
use Illuminate\Support\Facades\DB;

class StoreServiceCenterService
{
    public function __construct(
        protected ServiceCenter $storeServiceCenter,
        protected UserLogs $userLogs
    ) {}

    public function create(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $storeServiceCenter = $this->storeServiceCenter->create($data);
            $this->userLogs->logActivity("Service Center '{$storeServiceCenter->service_center_name}' created successfully.");

            return [
                'success' => true,
                'message' => 'Company created successfully',
                'data' => $storeServiceCenter
            ];
        });
    }

}

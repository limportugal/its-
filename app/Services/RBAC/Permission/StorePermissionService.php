<?php

namespace App\Services\RBAC\Permission;

use Spatie\Permission\Models\Permission;
use App\Models\UserLogs;
use Illuminate\Support\Facades\DB;

class StorePermissionService
{
    public function __construct(
        protected Permission $storePermission,
        protected UserLogs $userLogs
    ) {}

    public function create(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $storePermission = $this->storePermission->create($data);
            $this->userLogs->logActivity("Permission '{$storePermission->name}' created successfully.");
            return [
                'success' => true,
                'message' => 'Permission created successfully',
                'data' => $storePermission
            ];
        });
    }

}

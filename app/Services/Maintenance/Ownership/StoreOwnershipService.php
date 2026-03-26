<?php

namespace App\Services\Maintenance\Ownership;

use App\Models\Ownership;
use App\Models\UserLogs;
use Illuminate\Support\Facades\DB;

class StoreOwnershipService
{
    public function __construct(
        protected Ownership $ownership,
        protected UserLogs $userLogs
    ) {}

    public function create(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $created = $this->ownership->create($data);
            $this->userLogs->logActivity("Ownership '{$created->ownership_name}' created successfully.");

            return [
                'success' => true,
                'message' => 'Ownership created successfully',
                'data' => $created,
            ];
        });
    }
}
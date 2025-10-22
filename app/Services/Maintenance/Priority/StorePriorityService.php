<?php

namespace App\Services\Maintenance\Priority;

use App\Models\Priority;
use App\Models\UserLogs;
use Illuminate\Support\Facades\DB;

class StorePriorityService
{
    public function __construct(
        protected Priority $priority,
        protected UserLogs $userLogs
    ) {}

    public function create(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $priority = $this->priority->create($data);
            $this->userLogs->logActivity("Priority '{$priority->priority_name}' created successfully.");

            return [
                'success' => true,
                'message' => 'Priority created successfully',
                'data' => $priority
            ];
        });
    }

}

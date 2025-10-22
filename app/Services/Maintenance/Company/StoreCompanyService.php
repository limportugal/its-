<?php

namespace App\Services\Maintenance\Company;

use App\Models\Company;
use App\Models\UserLogs;
use Illuminate\Support\Facades\DB;

class StoreCompanyService
{
    public function __construct(
        protected Company $storeCompany,
        protected UserLogs $userLogs
    ) {}

    public function create(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $storeCompany = $this->storeCompany->create($data);
            $this->userLogs->logActivity("Company '{$storeCompany->company_name}' created successfully.");

            return [
                'success' => true,
                'message' => 'Company created successfully',
                'data' => $storeCompany
            ];
        });
    }

}

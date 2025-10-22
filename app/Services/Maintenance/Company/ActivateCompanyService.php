<?php

namespace App\Services\Maintenance\Company;

use App\Models\Company;
use App\Models\UserLogs;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ActivateCompanyService
{
    use AuthorizesRequests;

    public function __construct(
        protected Company $company,
        protected UserLogs $userLogs
    ) {}

    public function activate($id)
    {
        $company = $this->company->find($id);
        if (!$company) {
            return [
                'success' => false,
                'message' => 'Company not found.',
                'status' => 404
            ];
        }
        
        $this->authorize('activate', $company);
        $company->update(['status' => 'active']);
        $this->userLogs->logActivity("Company name ({$company->company_name}) activated successfully.");
        
        return [
            'success' => true,
            'message' => 'Company activated successfully'
        ];
    }
}

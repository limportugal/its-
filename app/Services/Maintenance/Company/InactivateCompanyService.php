<?php

namespace App\Services\Maintenance\Company;

use App\Models\Company;
use App\Models\UserLogs;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class InactivateCompanyService
{
    use AuthorizesRequests;

    public function __construct(
        protected Company $company,
        protected UserLogs $userLogs
    ) {}

    public function inactivate($id)
    {
        $company = $this->company->find($id);
        if (!$company) {
            return [
                'success' => false,
                'message' => 'Company not found.',
                'status' => 404
            ];
        }
        
        $this->authorize('inactivate', $company);
        $company->update(['status' => 'inactive']);
        $this->userLogs->logActivity("Company name ({$company->company_name}) inactivated successfully.");
        
        return [
            'success' => true,
            'message' => 'Company inactivated successfully'
        ];
    }
}

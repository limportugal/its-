<?php

namespace App\Services\Maintenance\Company;

use App\Models\Company;
use App\Models\UserLogs;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class DeleteCompanyService
{
    use AuthorizesRequests;

    public function __construct(
        protected Company $company,
        protected UserLogs $userLogs
    ) {}

    public function delete($id)
    {
        $company = $this->company->find($id);
        if (!$company) {
            return [
                'success' => false,
                'message' => 'Company not found.',
                'status' => 404
            ];
        }
        
        $this->authorize('delete', $company);
        $company->update(['status' => 'deleted']);
        $this->userLogs->logActivity("Company name ({$company->company_name}) deleted successfully.");
        
        return [
            'success' => true,
            'message' => 'Company deleted successfully'
        ];
    }
}

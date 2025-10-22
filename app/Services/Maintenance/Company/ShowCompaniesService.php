<?php

namespace App\Services\Maintenance\Company;

use App\Models\Company;

class ShowCompaniesService
{
    public function getCompanies()
    {
        return Company::select(
            'id',
            'company_name',
            'created_at',
            'status'
        )
            ->latest()
            ->notDeleted()
            ->get();
    }
}

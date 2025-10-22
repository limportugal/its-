<?php

namespace App\Http\Requests\Company;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Company;

class UpdateCompanyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', Company::class);
    }

    public function rules(): array
    {
        $updateCompanyId = $this->route('id');
        
        return [
            'company_name' => 'required|string|max:255|unique:companies,company_name,' . $updateCompanyId
        ];
    }
}

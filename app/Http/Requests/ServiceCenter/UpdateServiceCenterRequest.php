<?php

namespace App\Http\Requests\ServiceCenter;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\ServiceCenter;

class UpdateServiceCenterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', ServiceCenter::class);
    }

    public function rules(): array
    {
        $updateServiceCenterId = $this->route('id');
        
        return [
            'service_center_name' => 'required|string|max:255|unique:service_centers,service_center_name,' . $updateServiceCenterId
        ];
    }
}

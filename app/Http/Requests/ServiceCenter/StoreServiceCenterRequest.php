<?php

namespace App\Http\Requests\ServiceCenter;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\ServiceCenter;

class StoreServiceCenterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', ServiceCenter::class);
    }

    public function rules(): array
    {
        return [
            'service_center_name' => 'required|string|max:255|unique:service_centers,service_center_name'
        ];
    }
}

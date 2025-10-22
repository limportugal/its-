<?php

namespace App\Http\Requests\System;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\System;

class UpdateSystemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', System::class);
    }

    public function rules(): array
    {
        $updateSystemId = $this->route('id');
        
        return [
            'system_name' => 'required|string|max:255|unique:systems,system_name,' . $updateSystemId
        ];
    }
}

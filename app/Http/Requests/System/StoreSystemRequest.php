<?php

namespace App\Http\Requests\System;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\System;

class StoreSystemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', System::class);
    }

    public function rules(): array
    {
        return [
            'system_name' => 'required|string|max:255|unique:systems,system_name'
        ];
    }
}

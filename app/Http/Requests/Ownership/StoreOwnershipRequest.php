<?php

namespace App\Http\Requests\Ownership;

use App\Models\Ownership;
use Illuminate\Foundation\Http\FormRequest;

class StoreOwnershipRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Ownership::class);
    }

    public function rules(): array
    {
        return [
            'ownership_name' => 'required|string|max:100|unique:ownerships,ownership_name',
        ];
    }
}


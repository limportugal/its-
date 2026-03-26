<?php

namespace App\Http\Requests\StoreType;

use App\Models\StoreType;
use Illuminate\Foundation\Http\FormRequest;

class StoreStoreTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', StoreType::class);
    }

    public function rules(): array
    {
        return [
            'store_type_name' => 'required|string|max:100|unique:store_types,store_type_name',
        ];
    }
}
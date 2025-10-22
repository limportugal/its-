<?php

namespace App\Http\Requests\Priority;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Priority;

class StorePriorityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Priority::class);
    }

    public function rules(): array
    {
        return [
            'priority_name' => 'required|string|max:255|unique:priorities,priority_name',
            'description' => 'nullable|string|max:1000'
        ];
    }
}

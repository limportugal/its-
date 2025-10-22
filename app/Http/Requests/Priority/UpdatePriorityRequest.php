<?php

namespace App\Http\Requests\Priority;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Priority;

class UpdatePriorityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', Priority::class);
    }

    public function rules(): array
    {
        $priorityId = $this->route('id');

        return [
            'priority_name' => 'required|string|max:255|unique:priorities,priority_name,' . $priorityId,
            'description' => 'nullable|string|max:1000'
        ];
    }
}

<?php

namespace App\Http\Requests\Ownership;

use App\Models\Ownership;
use Illuminate\Foundation\Http\FormRequest;

class UpdateOwnershipRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', Ownership::class);
    }

    public function rules(): array
    {
        $ownershipId = $this->route('id');

        return [
            'ownership_name' => 'required|string|max:100|unique:ownerships,ownership_name,' . $ownershipId,
        ];
    }
}
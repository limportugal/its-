<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\User;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', User::class);
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'company_id' => 'required|integer|exists:companies,id',
            'roles' => 'required|array',
            'roles.*.id' => 'required|integer|exists:roles,id',
            'roles.*.name' => 'required|string',
            'team_leader_id' => 'nullable|integer|exists:users,id',
        ];
    }
}

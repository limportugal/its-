<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\User;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        $routeParam = $this->route('uuid');
        
        // Check if the route parameter is numeric (ID) or a UUID string
        if (is_numeric($routeParam)) {
            $userToUpdate = User::find($routeParam);
        } else {
            $userToUpdate = User::where('uuid', $routeParam)->first();
        }
        
        if (!$userToUpdate) {
            return false;
        }

        return $this->user()->can('update', $userToUpdate);
    }

    public function rules(): array
    {
        $routeParam = $this->route('uuid');
        
        // Get the user ID for unique validation
        $userId = null;
        if (is_numeric($routeParam)) {
            $userId = $routeParam;
        } else {
            $user = User::where('uuid', $routeParam)->first();
            $userId = $user ? $user->id : null;
        }
        
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $userId,
            'company_id' => 'required|integer|exists:companies,id',
            'roles' => 'required|array',
            'roles.*.id' => 'required|integer|exists:roles,id',
            'roles.*.name' => 'required|string',
            'team_leader_id' => 'nullable|integer|exists:users,id',
            // Temporary fix for permissions validation (should not be needed)
            'permissions' => 'nullable|array',
            'permissions.*' => 'integer|exists:permissions,id',
        ];
    }
}

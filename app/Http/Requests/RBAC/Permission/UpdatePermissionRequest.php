<?php

namespace App\Http\Requests\RBAC\Permission;

use Illuminate\Foundation\Http\FormRequest;
use Spatie\Permission\Models\Permission;

class UpdatePermissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', Permission::class);
    }

    public function rules(): array
    {
        $permissionId = $this->route('id');

        return [
            'name' => 'required|string|max:255|unique:permissions,name,' . $permissionId,
        ];
    }
}

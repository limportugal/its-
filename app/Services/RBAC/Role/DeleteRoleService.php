<?php

namespace App\Services\RBAC\Role;

use App\Models\UserLogs;
use Spatie\Permission\Models\Role;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class DeleteRoleService
{
    use AuthorizesRequests;

    public function __construct(
        protected Role $role,
        protected UserLogs $userLogs
    ) {}

    public function delete($id)
    {
        $role = $this->role->find($id);
        if (!$role) {
            return [
                'success' => false,
                'message' => 'Role not found.',
                'status' => 404
            ];
        }
        
        $this->authorize('delete', $role);
        $role->delete();
        $this->userLogs->logActivity("Role name ({$role->name}) deleted successfully.");
        
        return [
            'success' => true,
            'message' => 'Role name deleted successfully!'
        ];
    }
}

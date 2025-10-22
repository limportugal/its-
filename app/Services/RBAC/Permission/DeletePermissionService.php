<?php

namespace App\Services\RBAC\Permission;

use App\Models\UserLogs;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class DeletePermissionService
{
    use AuthorizesRequests;

    public function __construct(
        protected Permission $permission,
        protected UserLogs $userLogs
    ) {}

    public function delete($id)
    {
        $permission = $this->permission->find($id);
        if (!$permission) {
            return [
                'success' => false,
                'message' => 'Permission not found.',
                'status' => 404
            ];
        }
        
        $this->authorize('delete', $permission);
        $permission->delete();
        $this->userLogs->logActivity("Permission name ({$permission->name}) deleted successfully.");
        
        return [
            'success' => true,
            'message' => 'Permission deleted successfully'
        ];
    }
}

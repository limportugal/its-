<?php

namespace App\Http\Controllers\RBAC;

use Inertia\Inertia;
use App\Http\Controllers\Controller;

// SPATIE MODELS
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

// REQUESTS VALIDATION
use App\Http\Requests\RBAC\Role\StoreRoleRequest;
use App\Http\Requests\RBAC\Role\UpdateRoleRequest;

// SERVICES
use App\Services\RBAC\Role\IndexRolesService;
use App\Services\RBAC\Role\ShowRolesService;
use App\Services\RBAC\Role\StoreRoleService;
use App\Services\RBAC\Role\UpdateRoleService;
use App\Services\RBAC\Role\DeleteRoleService;


class RoleController extends Controller
{

    protected IndexRolesService $indexRolesService;
    protected ShowRolesService $showRolesService;
    protected StoreRoleService $storeRoleService;
    protected UpdateRoleService $updateRoleService;
    protected DeleteRoleService $deleteRoleService;

    public function __construct(
        IndexRolesService $indexRolesService,
        ShowRolesService $showRolesService,
        StoreRoleService $storeRoleService,
        UpdateRoleService $updateRoleService,
        DeleteRoleService $deleteRoleService
    ) {
        $this->indexRolesService = $indexRolesService;
        $this->showRolesService = $showRolesService;
        $this->storeRoleService = $storeRoleService;
        $this->updateRoleService = $updateRoleService;
        $this->deleteRoleService = $deleteRoleService;
    }
    public function index(IndexRolesService $indexRolesService)
    {
        $data = $indexRolesService->index();
        return Inertia::render('RolesAndPermissions/Roles/IndexRoles', $data);
    }

    public function show()
    {
        $roles = $this->showRolesService->show();
        return response()->json($roles);
    }

    public function getPermissions($id)
    {
        $role = Role::with('permissions')->find($id);
        if (!$role) {
            return response()->json(['error' => 'Role not found'], 404);
        }
        
        // Explicitly select the fields we need
        $permissions = $role->permissions->map(function($permission) {
            return [
                'id' => $permission->id,
                'name' => $permission->name,
                'guard_name' => $permission->guard_name,
                'created_at' => $permission->created_at->toISOString(),
                'updated_at' => $permission->updated_at->toISOString(),
            ];
        });
        
        return response()->json($permissions);
    }

    public function getAllPermissions()
    {
        $permissions = Permission::all();
        return response()->json($permissions);
    }

    public function store(StoreRoleRequest $request)
    {
        $result = $this->storeRoleService->store($request);
        return response()->json($result, 201);
    }

    public function update(UpdateRoleRequest $request, $id)
    {
        $result = $this->updateRoleService->update($id, $request->validated());
        return response()->json($result, 200);
    }

    public function destroy($id)
    {
        $result = $this->deleteRoleService->delete($id);
        return response()->json($result);
    }
}

<?php

namespace App\Http\Controllers\RBAC;

use Inertia\Inertia;
use App\Http\Controllers\Controller;

// REQUESTS
use App\Http\Requests\RBAC\Permission\StorePermissionRequest;
use App\Http\Requests\RBAC\Permission\UpdatePermissionRequest;

// SERVICES
use App\Services\RBAC\Permission\IndexpermissionsService;
use App\Services\RBAC\Permission\ShowPermissionsService;
use App\Services\RBAC\Permission\StorePermissionService;
use App\Services\RBAC\Permission\UpdatePermissionService;
use App\Services\RBAC\Permission\DeletePermissionService;


class PermissionController extends Controller
{
    protected IndexpermissionsService $indexpermissionsService;
    protected ShowPermissionsService $showPermissionsService;
    protected StorePermissionService $storePermissionService;
    protected UpdatePermissionService $updatePermissionService;
    protected DeletePermissionService $deletePermissionService;

    public function __construct(
        IndexpermissionsService $indexpermissionsService,
        ShowPermissionsService $showPermissionsService,
        StorePermissionService $storePermissionService,
        UpdatePermissionService $updatePermissionService,
        DeletePermissionService $deletePermissionService
    ) {
        $this->indexpermissionsService = $indexpermissionsService;
        $this->showPermissionsService = $showPermissionsService;
        $this->storePermissionService = $storePermissionService;
        $this->updatePermissionService = $updatePermissionService;
        $this->deletePermissionService = $deletePermissionService;
    }

    public function index()
    {
        $permissions = $this->indexpermissionsService->getUserPermissions();
        return Inertia::render('RolesAndPermissions/Permissions/IndexPermissions', [
            'userPermissions' => $permissions
        ]);
    }

    public function show()
    {
        $showPermissions = $this->showPermissionsService->getPermissions();
        return response()->json($showPermissions);
    }

    public function store(StorePermissionRequest $request)
    {
        $storePermission = $this->storePermissionService->create($request->validated());
        return response()->json($storePermission);
    }

    public function update(UpdatePermissionRequest $request, $id)
    {
        $updatePermission = $this->updatePermissionService->update($id, $request->validated());
        return response()->json($updatePermission);
    }

    public function destroy($id)
    {
        $deletePermission = $this->deletePermissionService->delete($id);
        return response()->json($deletePermission);
    }
}

<?php

namespace App\Http\Controllers\User;

// INERTIA & CONTROLLER
use Inertia\Inertia;
use App\Http\Controllers\Controller;

// MODELS
use Spatie\Permission\Models\Role;
use App\Models\Company;

// SERVICES
use App\Services\User\IndexUserService;
use App\Services\User\StoreUserService;
use App\Services\User\UpdateUserService;
use App\Services\User\GetUsersImageService;
use App\Services\User\ShowActiveUsersService;
use App\Services\User\ShowInactiveUsersService;
use App\Services\User\ActivateUserService;
use App\Services\User\DeactivateUserService;
use App\Services\User\DeleteUserService;
use App\Services\User\GetUserRoleDropdownService;
use App\Services\User\GetUpdateUserRoleDropdownService;
use App\Services\User\TeamLeaderDropdownService;

// VALIDATION REQUEST
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
class UserController extends Controller
{
    protected IndexUserService $indexUserService;
    protected StoreUserService $storeUserService;
    protected UpdateUserService $updateUserService;
    protected GetUsersImageService $getUsersImageService;
    protected ShowActiveUsersService $showActiveUsersService;
    protected ShowInactiveUsersService $showInactiveUsersService;
    protected ActivateUserService $activateUserService;
    protected DeactivateUserService $deactivateUserService;
    protected DeleteUserService $deleteUserService;
    protected GetUserRoleDropdownService $getUserRoleDropdownService;
    protected GetUpdateUserRoleDropdownService $getUpdateUserRoleDropdownService;
    protected TeamLeaderDropdownService $teamLeaderDropdownService;

    public function __construct(
        IndexUserService $indexUserService,
        StoreUserService $storeUserService,
        UpdateUserService $updateUserService,
        GetUsersImageService $getUsersImageService,
        ShowActiveUsersService $showActiveUsersService,
        ShowInactiveUsersService $showInactiveUsersService,
        ActivateUserService $activateUserService,
        DeactivateUserService $deactivateUserService,
        DeleteUserService $deleteUserService,
        GetUserRoleDropdownService $getUserRoleDropdownService,
        GetUpdateUserRoleDropdownService $getUpdateUserRoleDropdownService,
        TeamLeaderDropdownService $teamLeaderDropdownService
    ) {
        $this->indexUserService = $indexUserService;
        $this->storeUserService = $storeUserService;
        $this->updateUserService = $updateUserService;
        $this->getUsersImageService = $getUsersImageService;
        $this->showActiveUsersService = $showActiveUsersService;
        $this->showInactiveUsersService = $showInactiveUsersService;
        $this->activateUserService = $activateUserService;
        $this->deactivateUserService = $deactivateUserService;
        $this->deleteUserService = $deleteUserService;
        $this->getUserRoleDropdownService = $getUserRoleDropdownService;
        $this->getUpdateUserRoleDropdownService = $getUpdateUserRoleDropdownService;
        $this->teamLeaderDropdownService = $teamLeaderDropdownService;
    }

    public function indexActiveUsers()
    {
        $indexUsers = $this->indexUserService->index();
        return Inertia::render('Users/UserNavTabs', $indexUsers);
    }

    public function indexInactiveUsers()
    {
        $indexUsers = $this->indexUserService->index();
        return Inertia::render('Users/UserNavTabs', $indexUsers);
    }

    public function showActiveUsersData()
    {
        $showActiveUsers = $this->showActiveUsersService->getActiveUsers();
        return response()->json($showActiveUsers);
    }

    public function showInactiveUsersData()
    {
        $showInactiveUsers = $this->showInactiveUsersService->getInactiveUsers();
        return response()->json($showInactiveUsers);
    }
    
    public function create(StoreUserRequest $request)
    {
        $result = $this->storeUserService->create($request);
        return response()->json($result);
    }

    public function update(UpdateUserRequest $request, $uuid)
    {
        $result = $this->updateUserService->update($request, $uuid);
        return response()->json($result);
    }

    public function getUsersImage()
    {
        $users = $this->getUsersImageService->getUsersImage();
        return response()->json($users);
    }

    public function activateUser($uuid)
    {
        $result = $this->activateUserService->activateUser($uuid);
        return response()->json($result);
    }

    public function deactivateUser($uuid)
    {
        $result = $this->deactivateUserService->deactivateUser($uuid);
        return response()->json($result);
    }

    public function deleteUser($uuid)
    {
        $result = $this->deleteUserService->deleteUser($uuid);
        return response()->json($result);
    }

    public function UserRoleDropdown()
    {
        $showRole = $this->getUserRoleDropdownService->getUserRoleDropdown();
        return response()->json(['data' => $showRole]);
    }

    public function UserCompanyDropdown()
    {
        $showCompany = Company::select('id', 'company_name')->get();
        return response()->json(['data' => $showCompany]);
    }

    public function UpdateUserRoleDropdown()
    {
        $showRole = $this->getUpdateUserRoleDropdownService->getUserRoleDropdown();
        return response()->json(['data' => $showRole]);
    }

    public function TeamLeaderDropdown()
    {
        $teamLeaders = $this->teamLeaderDropdownService->getTeamLeaderDropdown();
        return response()->json(['data' => $teamLeaders]);
    }
}

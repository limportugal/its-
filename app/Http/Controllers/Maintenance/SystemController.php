<?php

namespace App\Http\Controllers\Maintenance;

use App\Http\Controllers\Controller;

// MODELS
use App\Models\System;

// VALIDATION REQUESTS
use App\Http\Requests\System\StoreSystemRequest;
use App\Http\Requests\System\UpdateSystemRequest;

// SERVICES
use App\Services\Maintenance\System\IndexSystemService;
use App\Services\Maintenance\System\StoreSystemService;
use App\Services\Maintenance\System\ShowSystemsService;
use App\Services\Maintenance\System\ShowSystemCategoriesService;
use App\Services\Maintenance\System\UpdateSystemService;
use App\Services\Maintenance\System\DeleteSystemService;
use App\Services\Maintenance\System\ActivateSystemService;
use App\Services\Maintenance\System\InactivateSystemService;

class SystemController extends Controller
{
    protected IndexSystemService $indexSystemService;
    protected ShowSystemsService $showSystemsService;
    protected ShowSystemCategoriesService $showSystemCategoriesService;
    protected StoreSystemService $storeSystemService;
    protected UpdateSystemService $updateSystemService;
    protected DeleteSystemService $deleteSystemService;
    protected ActivateSystemService $activateSystemService;
    protected InactivateSystemService $inactivateSystemService;

    public function __construct(
        IndexSystemService $indexSystemService,
        ShowSystemsService $showSystemsService,
        ShowSystemCategoriesService $showSystemCategoriesService,
        StoreSystemService $storeSystemService,
        UpdateSystemService $updateSystemService,
        DeleteSystemService $deleteSystemService,
        ActivateSystemService $activateSystemService,
        InactivateSystemService $inactivateSystemService
    ) {
        $this->indexSystemService = $indexSystemService;
        $this->showSystemsService = $showSystemsService;
        $this->showSystemCategoriesService = $showSystemCategoriesService;
        $this->storeSystemService = $storeSystemService;
        $this->updateSystemService = $updateSystemService;
        $this->deleteSystemService = $deleteSystemService;
        $this->activateSystemService = $activateSystemService;
        $this->inactivateSystemService = $inactivateSystemService;
    }

    public function index()
    {
        return $this->indexSystemService->getIndexData();
    }

    public function show()
    {
       $showSystems = $this->showSystemsService->getSystems();
       return response()->json($showSystems);
    }

    public function create(StoreSystemRequest $request)
    {
        $storedSystem = $this->storeSystemService->create($request->validated());
        return response()->json($storedSystem, 201);
    }

    public function update(UpdateSystemRequest $request, $id)
    {
        $updatedSystem = $this->updateSystemService->update($id, $request->validated());
        return response()->json($updatedSystem, 200);
    }

    public function destroy($id)
    {
        $deletedSystem = $this->deleteSystemService->delete($id);
        return response()->json($deletedSystem, 200);
    }

    public function activate($id)
    {
        $activatedSystem = $this->activateSystemService->activate($id);
        return response()->json($activatedSystem, 200);
    }

    public function inactivate($id)
    {
        $inactivatedSystem = $this->inactivateSystemService->inactivate($id);
        return response()->json($inactivatedSystem, 200);
    }

    public function showCategories($systemName, $systemUuid)
    {
        $system = System::findBySlugAndUuid($systemName, $systemUuid);
        $systemCategories = $this->showSystemCategoriesService->getSystemCategories($systemUuid);
        return response()->json($systemCategories);
    }
}

<?php

namespace App\Http\Controllers\Maintenance;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreType\StoreStoreTypeRequest;
use App\Http\Requests\StoreType\UpdateStoreTypeRequest;
use App\Services\Maintenance\StoreType\ActivateStoreTypeService;
use App\Services\Maintenance\StoreType\DeleteStoreTypeService;
use App\Services\Maintenance\StoreType\InactivateStoreTypeService;
use App\Services\Maintenance\StoreType\IndexStoreTypeService;
use App\Services\Maintenance\StoreType\ShowStoreTypesService;
use App\Services\Maintenance\StoreType\StoreStoreTypeService;
use App\Services\Maintenance\StoreType\UpdateStoreTypeService;

class StoreTypeController extends Controller
{
    public function __construct(
        protected IndexStoreTypeService $indexStoreTypeService,
        protected ShowStoreTypesService $showStoreTypesService,
        protected StoreStoreTypeService $storeStoreTypeService,
        protected UpdateStoreTypeService $updateStoreTypeService,
        protected DeleteStoreTypeService $deleteStoreTypeService,
        protected ActivateStoreTypeService $activateStoreTypeService,
        protected InactivateStoreTypeService $inactivateStoreTypeService
    ) {}

    public function index()
    {
        return $this->indexStoreTypeService->getIndexData();
    }

    public function show()
    {
        $storeTypes = $this->showStoreTypesService->getStoreTypes();
        return response()->json($storeTypes);
    }

    public function create(StoreStoreTypeRequest $request)
    {
        $created = $this->storeStoreTypeService->create($request->validated());
        return response()->json($created, 201);
    }

    public function update(UpdateStoreTypeRequest $request, $id)
    {
        $updated = $this->updateStoreTypeService->update((int) $id, $request->validated());
        return response()->json($updated, 200);
    }

    public function destroy($id)
    {
        $deleted = $this->deleteStoreTypeService->delete((int) $id);
        return response()->json($deleted, 200);
    }

    public function activate($id)
    {
        $activated = $this->activateStoreTypeService->activate((int) $id);
        return response()->json($activated, 200);
    }

    public function inactivate($id)
    {
        $inactivated = $this->inactivateStoreTypeService->inactivate((int) $id);
        return response()->json($inactivated, 200);
    }
}

<?php

namespace App\Http\Controllers\Maintenance;

use App\Http\Controllers\Controller;

// VALIDATION REQUESTS
use App\Http\Requests\ServiceCenter\StoreServiceCenterRequest;
use App\Http\Requests\ServiceCenter\UpdateServiceCenterRequest;

// SERVICES
use App\Services\Maintenance\ServiceCenter\IndexServiceCenterService;
use App\Services\Maintenance\ServiceCenter\StoreServiceCenterService;
use App\Services\Maintenance\ServiceCenter\ShowServiceCenterService;
use App\Services\Maintenance\ServiceCenter\UpdateServiceCenterService;
use App\Services\Maintenance\ServiceCenter\DeleteServiceCenterService;
use App\Services\Maintenance\ServiceCenter\ActivateServiceCenterService;
use App\Services\Maintenance\ServiceCenter\InactivateServiceCenterService;

class ServiceCenterController extends Controller
{
    protected IndexServiceCenterService $indexServiceCenterService;
    protected ShowServiceCenterService $showServiceCenterService;
    protected StoreServiceCenterService $storeServiceCenterService;
    protected UpdateServiceCenterService $updateServiceCenterService;
    protected DeleteServiceCenterService $deleteServiceCenterService;
    protected ActivateServiceCenterService $activateServiceCenterService;
    protected InactivateServiceCenterService $inactivateServiceCenterService;

    public function __construct(
        IndexServiceCenterService $indexServiceCenterService,
        ShowServiceCenterService $showServiceCenterService,
        StoreServiceCenterService $storeServiceCenterService,
        UpdateServiceCenterService $updateServiceCenterService,
        DeleteServiceCenterService $deleteServiceCenterService,
        ActivateServiceCenterService $activateServiceCenterService,
        InactivateServiceCenterService $inactivateServiceCenterService
    ) {
        $this->indexServiceCenterService = $indexServiceCenterService;
        $this->showServiceCenterService = $showServiceCenterService;
        $this->storeServiceCenterService = $storeServiceCenterService;
        $this->updateServiceCenterService = $updateServiceCenterService;
        $this->deleteServiceCenterService = $deleteServiceCenterService;
        $this->activateServiceCenterService = $activateServiceCenterService;
        $this->inactivateServiceCenterService = $inactivateServiceCenterService;
    }

    public function index()
    {
        return $this->indexServiceCenterService->getIndexData();
    }

    public function show()
    {
       $showServiceCenters = $this->showServiceCenterService->getServiceCenters();
       return response()->json($showServiceCenters);
    }

    public function create(StoreServiceCenterRequest $request)
    {
        $storedServiceCenter = $this->storeServiceCenterService->create($request->validated());
        return response()->json($storedServiceCenter, 201);
    }

    public function update(UpdateServiceCenterRequest $request, $id)
    {
        $updatedServiceCenter = $this->updateServiceCenterService->update($id, $request->validated());
        return response()->json($updatedServiceCenter, 200);
    }

    public function destroy($id)
    {
        $deletedServiceCenter = $this->deleteServiceCenterService->delete($id);
        return response()->json($deletedServiceCenter, 200);
    }

    public function activate($id)
    {
        $activatedServiceCenter = $this->activateServiceCenterService->activate($id);
        return response()->json($activatedServiceCenter, 200);
    }

    public function inactivate($id)
    {
        $inactivatedServiceCenter = $this->inactivateServiceCenterService->inactivate($id);
        return response()->json($inactivatedServiceCenter, 200);
    }
}

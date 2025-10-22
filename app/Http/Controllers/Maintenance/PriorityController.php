<?php

namespace App\Http\Controllers\Maintenance;

use App\Http\Controllers\Controller;

// SERVICES
use App\Services\Maintenance\Priority\IndexPriorityService;
use App\Services\Maintenance\Priority\ShowPrioritiesService;
use App\Services\Maintenance\Priority\StorePriorityService;
use App\Services\Maintenance\Priority\UpdatePriorityService;
use App\Services\Maintenance\Priority\DeletePriorityService;
use App\Services\Maintenance\Priority\ActivatePriorityService;
use App\Services\Maintenance\Priority\InactivatePriorityService;

// VALIDATION REQUESTS
use App\Http\Requests\Priority\StorePriorityRequest;
use App\Http\Requests\Priority\UpdatePriorityRequest;
class PriorityController extends Controller
{
    protected IndexPriorityService $indexPriorityService;
    protected ShowPrioritiesService $showPrioritiesService;
    protected StorePriorityService $storePriorityService;
    protected UpdatePriorityService $updatePriorityService;
    protected DeletePriorityService $deletePriorityService;
    protected ActivatePriorityService $activatePriorityService;
    protected InactivatePriorityService $inactivatePriorityService;

    public function __construct(
        IndexPriorityService $indexPriorityService,
        ShowPrioritiesService $showPrioritiesService,
        StorePriorityService $storePriorityService,
        UpdatePriorityService $updatePriorityService,
        DeletePriorityService $deletePriorityService,
        ActivatePriorityService $activatePriorityService,
        InactivatePriorityService $inactivatePriorityService
    ) {
        $this->indexPriorityService = $indexPriorityService;
        $this->showPrioritiesService = $showPrioritiesService;
        $this->storePriorityService = $storePriorityService;
        $this->updatePriorityService = $updatePriorityService;
        $this->deletePriorityService = $deletePriorityService;
        $this->activatePriorityService = $activatePriorityService;
        $this->inactivatePriorityService = $inactivatePriorityService;
    }

    public function index()
    {
        return $this->indexPriorityService->getIndexData();
    }

    public function show()
    {
        $showPriorities = $this->showPrioritiesService->getPriorities();
        return response()->json($showPriorities);
    }

    public function create(StorePriorityRequest $request)
    {
        $storedPriority = $this->storePriorityService->create($request->validated());
        return response()->json($storedPriority, 201);
    }

    public function update(UpdatePriorityRequest $request, $id)
    {
        $updatedPriority = $this->updatePriorityService->update($id, $request->validated());
        return response()->json($updatedPriority);
    }

    public function destroy($id)
    {
        $deletedPriority = $this->deletePriorityService->delete($id);
        return response()->json($deletedPriority);
    }

    public function activate($id)
    {
        $activatedPriority = $this->activatePriorityService->activate($id);
        return response()->json($activatedPriority, 200);
    }

    public function inactivate($id)
    {
        $inactivatedPriority = $this->inactivatePriorityService->inactivate($id);
        return response()->json($inactivatedPriority, 200);
    }
}

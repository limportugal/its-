<?php

namespace App\Http\Controllers\Maintenance;

use App\Http\Controllers\Controller;
use App\Http\Requests\Ownership\StoreOwnershipRequest;
use App\Http\Requests\Ownership\UpdateOwnershipRequest;
use App\Services\Maintenance\Ownership\ActivateOwnershipService;
use App\Services\Maintenance\Ownership\DeleteOwnershipService;
use App\Services\Maintenance\Ownership\InactivateOwnershipService;
use App\Services\Maintenance\Ownership\IndexOwnershipService;
use App\Services\Maintenance\Ownership\ShowOwnershipsService;
use App\Services\Maintenance\Ownership\StoreOwnershipService;
use App\Services\Maintenance\Ownership\UpdateOwnershipService;

class OwnershipController extends Controller
{
    public function __construct(
        protected IndexOwnershipService $indexOwnershipService,
        protected ShowOwnershipsService $showOwnershipsService,
        protected StoreOwnershipService $storeOwnershipService,
        protected UpdateOwnershipService $updateOwnershipService,
        protected DeleteOwnershipService $deleteOwnershipService,
        protected ActivateOwnershipService $activateOwnershipService,
        protected InactivateOwnershipService $inactivateOwnershipService
    ) {}

    public function index()
    {
        return $this->indexOwnershipService->getIndexData();
    }

    public function show()
    {
        $ownerships = $this->showOwnershipsService->getOwnerships();
        return response()->json($ownerships);
    }

    public function create(StoreOwnershipRequest $request)
    {
        $created = $this->storeOwnershipService->create($request->validated());
        return response()->json($created, 201);
    }

    public function update(UpdateOwnershipRequest $request, $id)
    {
        $updated = $this->updateOwnershipService->update((int) $id, $request->validated());
        return response()->json($updated, 200);
    }

    public function destroy($id)
    {
        $deleted = $this->deleteOwnershipService->delete((int) $id);
        return response()->json($deleted, 200);
    }

    public function activate($id)
    {
        $activated = $this->activateOwnershipService->activate((int) $id);
        return response()->json($activated, 200);
    }

    public function inactivate($id)
    {
        $inactivated = $this->inactivateOwnershipService->inactivate((int) $id);
        return response()->json($inactivated, 200);
    }
}

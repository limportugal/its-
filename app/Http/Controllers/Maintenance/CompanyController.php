<?php

namespace App\Http\Controllers\Maintenance;

use Inertia\Inertia;
use App\Http\Controllers\Controller;

// MODEL
use App\Models\Company;

// VALIDATION REQUESTS
use App\Http\Requests\Company\StoreCompanyRequest;
use App\Http\Requests\Company\UpdateCompanyRequest;

// SERVICES
use App\Services\Maintenance\Company\IndexCompanyService;
use App\Services\Maintenance\Company\StoreCompanyService;
use App\Services\Maintenance\Company\ShowCompaniesService;
use App\Services\Maintenance\Company\UpdateCompanyService;
use App\Services\Maintenance\Company\DeleteCompanyService;
use App\Services\Maintenance\Company\ActivateCompanyService;
use App\Services\Maintenance\Company\InactivateCompanyService;

class CompanyController extends Controller
{
    protected IndexCompanyService $indexCompanyService;
    protected ShowCompaniesService $showCompaniesService;
    protected StoreCompanyService $storeCompanyService;
    protected UpdateCompanyService $updateCompanyService;
    protected DeleteCompanyService $deleteCompanyService;
    protected ActivateCompanyService $activateCompanyService;
    protected InactivateCompanyService $inactivateCompanyService;

    public function __construct(
        IndexCompanyService $indexCompanyService,
        ShowCompaniesService $showCompaniesService,
        StoreCompanyService $storeCompanyService,
        UpdateCompanyService $updateCompanyService,
        DeleteCompanyService $deleteCompanyService,
        ActivateCompanyService $activateCompanyService,
        InactivateCompanyService $inactivateCompanyService
    ) {
        $this->indexCompanyService = $indexCompanyService;
        $this->showCompaniesService = $showCompaniesService;
        $this->storeCompanyService = $storeCompanyService;
        $this->updateCompanyService = $updateCompanyService;
        $this->deleteCompanyService = $deleteCompanyService;
        $this->activateCompanyService = $activateCompanyService;
        $this->inactivateCompanyService = $inactivateCompanyService;
    }

    public function index()
    {
        return $this->indexCompanyService->getIndexData();
    }

    public function show()
    {
       $companies = $this->showCompaniesService->getCompanies();
       return response()->json($companies);
    }

    public function create(StoreCompanyRequest $request)
    {
        $storedCompany = $this->storeCompanyService->create($request->validated());
        return response()->json($storedCompany, 201);
    }

    public function update(UpdateCompanyRequest $request, $id)
    {
        $updatedCompany = $this->updateCompanyService->update($id, $request->validated());
        return response()->json($updatedCompany, 200);
    }

    public function destroy($id)
    {
        $deletedCompany = $this->deleteCompanyService->delete($id);
        return response()->json($deletedCompany, 200);
    }

    public function activate($id)
    {
        $activatedCompany = $this->activateCompanyService->activate($id);
        return response()->json($activatedCompany, 200);
    }

    public function inactivate($id)
    {
        $inactivatedCompany = $this->inactivateCompanyService->inactivate($id);
        return response()->json($inactivatedCompany, 200);
    }
}

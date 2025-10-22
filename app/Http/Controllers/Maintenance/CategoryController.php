<?php

namespace App\Http\Controllers\Maintenance;

use App\Http\Controllers\Controller;
use App\Models\System;

// VALIDATION REQUESTS
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;

// SERVICES
use App\Services\Maintenance\Category\StoreCategoryService;
use App\Services\Maintenance\Category\ShowCategoriesService;
use App\Services\Maintenance\Category\UpdateCategoryService;
use App\Services\Maintenance\Category\DeleteCategoryService;
use App\Services\Maintenance\Category\ActivateCategoryService;
use App\Services\Maintenance\Category\InactivateCategoryService;

class CategoryController extends Controller
{
    protected StoreCategoryService $storeCategoryService;
    protected ShowCategoriesService $showCategoriesService;
    protected UpdateCategoryService $updateCategoryService;
    protected DeleteCategoryService $deleteCategoryService;
    protected ActivateCategoryService $activateCategoryService;
    protected InactivateCategoryService $inactivateCategoryService;

    public function __construct(
        StoreCategoryService $storeCategoryService,
        ShowCategoriesService $showCategoriesService,
        UpdateCategoryService $updateCategoryService,
        DeleteCategoryService $deleteCategoryService,
        ActivateCategoryService $activateCategoryService,
        InactivateCategoryService $inactivateCategoryService
    )
    {
        $this->storeCategoryService = $storeCategoryService;
        $this->showCategoriesService = $showCategoriesService;
        $this->updateCategoryService = $updateCategoryService;
        $this->deleteCategoryService = $deleteCategoryService;
        $this->activateCategoryService = $activateCategoryService;
        $this->inactivateCategoryService = $inactivateCategoryService;
    }

    public function show()
    {
        $showCategories = $this->showCategoriesService->getCategories();
        return response()->json($showCategories);
    }

    public function create(StoreCategoryRequest $request)
    {
        // GET VALIDATED DATA AND MERGE WITH SYSTEM_ID FROM REQUEST
        $validatedData = $request->validated();
        if ($request->has('system_id')) {
            $systemId = $request->input('system_id');
            
            // IF SYSTEM_ID IS A UUID, CONVERT IT TO INTEGER ID
            if (is_string($systemId) && strlen($systemId) === 36) {
                $system = System::getIdByUuid($systemId);
                $validatedData['system_id'] = $system;
            } else {
                $validatedData['system_id'] = $systemId;
            }
        }
        
        $storedCategory = $this->storeCategoryService->create($validatedData);
        return response()->json($storedCategory, 201);
    }

    public function update(UpdateCategoryRequest $request, $id)
    {
        // GET VALIDATED DATA AND MERGE WITH SYSTEM_ID FROM REQUEST
        $validatedData = $request->validated();
        if ($request->has('system_id')) {
            $systemId = $request->input('system_id');
            
            // IF SYSTEM_ID IS A UUID, CONVERT IT TO INTEGER ID
            if (is_string($systemId) && strlen($systemId) === 36) {
                $system = System::getIdByUuid($systemId);
                $validatedData['system_id'] = $system;
            } else {
                $validatedData['system_id'] = $systemId;
            }
        }
        
        $updatedCategory = $this->updateCategoryService->update($id, $validatedData);
        return response()->json($updatedCategory);
    }

    public function destroy($id)
    {
        $deletedCategory = $this->deleteCategoryService->delete($id);
        return response()->json($deletedCategory);
    }

    public function activate($id)
    {
        $activatedCategory = $this->activateCategoryService->activate($id);
        return response()->json($activatedCategory, 200);
    }

    public function inactivate($id)
    {
        $inactivatedCategory = $this->inactivateCategoryService->inactivate($id);
        return response()->json($inactivatedCategory, 200);
    }
}

<?php

namespace App\Services\Maintenance\Category;

use App\Models\Category;
use App\Models\UserLogs;
use Illuminate\Support\Facades\DB;

class ActivateCategoryService
{
    public function __construct(
        protected Category $category,
        protected UserLogs $userLogs
    ) {}

    public function activate($id): array
    {
        return DB::transaction(function () use ($id) {
            $category = $this->category->findOrFail($id);
            $category->update(['status' => 'active']);
            $this->userLogs->logActivity("Category '{$category->category_name}' activated successfully.");

            return [
                'success' => true,
                'message' => 'Category activated successfully',
                'data' => $category
            ];
        });
    }
}

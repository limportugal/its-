<?php

namespace App\Services\Maintenance\Category;

use App\Models\Category;
use App\Models\UserLogs;
use Illuminate\Support\Facades\DB;

class InactivateCategoryService
{
    public function __construct(
        protected Category $category,
        protected UserLogs $userLogs
    ) {}

    public function inactivate($id): array
    {
        return DB::transaction(function () use ($id) {
            $category = $this->category->findOrFail($id);
            $category->update(['status' => 'inactive']);
            $this->userLogs->logActivity("Category '{$category->category_name}' inactivated successfully.");

            return [
                'success' => true,
                'message' => 'Category inactivated successfully',
                'data' => $category
            ];
        });
    }
}

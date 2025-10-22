<?php

namespace App\Services\Maintenance\Category;

use App\Models\Category;
use App\Models\UserLogs;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class DeleteCategoryService
{
    use AuthorizesRequests;

    public function __construct(
        protected Category $category,
        protected UserLogs $userLogs
    ) {}

    public function delete($id)
    {
        $category = $this->category->find($id);
        if (!$category) {
            return [
                'success' => false,
                'message' => 'Category not found.',
                'status' => 404
            ];
        }
        
        $this->authorize('delete', $category);
        $category->update(['status' => 'deleted']);
        $this->userLogs->logActivity("Category name ({$category->category_name}) deleted successfully.");
        
        return [
            'success' => true,
            'message' => 'Category deleted successfully'
        ];
    }
}

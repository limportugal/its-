<?php

namespace App\Services\Maintenance\Category;

use App\Models\Category;
use App\Models\UserLogs;
use Illuminate\Support\Facades\DB;

class StoreCategoryService
{
    public function __construct(
        protected Category $category,
        protected UserLogs $userLogs
    ) {}

    public function create(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $category = $this->category->create($data);
            $this->userLogs->logActivity("Category '{$category->category_name}' created successfully.");

            // Load the system relationship and handle null case
            $systemName = $category->system ? $category->system->system_name : 'Unknown System';

            return [
                'category' => $category->category_name,
                'system' => $systemName,
                'message' => 'Category created successfully',
            ];
        });
    }

}

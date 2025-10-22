<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Category;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', Category::class);
    }

    public function rules(): array
    {
        return [
            'category_name' => 'required|string|max:255',
            'system_id' => 'required',
        ];
    }
    
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $categoryName = $this->input('category_name');
            $systemId = $this->input('system_id');
            $updateCategoryId = $this->route('id');
            
            // CONVERT UUID TO INTEGER ID IF NEEDED
            if (is_string($systemId) && strlen($systemId) === 36) {
                $system = \App\Models\System::where('uuid', $systemId)->first();
                $systemId = $system ? $system->id : null;
            }
            
            // CHECK IF CATEGORY NAME EXISTS FOR THIS SYSTEM (EXCLUDING CURRENT RECORD)
            $exists = \App\Models\Category::where('category_name', $categoryName)
                ->where('system_id', $systemId)
                ->where('id', '!=', $updateCategoryId)
                ->exists();
            
            if ($exists) {
                $validator->errors()->add('category_name', 'The category name has already been taken for this system.');
            }
        });
    }
}

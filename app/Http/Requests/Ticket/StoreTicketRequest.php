<?php

namespace App\Http\Requests\Ticket;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\System;
use App\Models\Category;

class StoreTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'full_name'         => ['required', 'string', 'min:6', 'max:100'],
            'email'             => ['required', 'email:rfc,dns', 'min:8', 'max:100'],
            'service_center_id' => ['required', 'integer', 'exists:service_centers,id'],
            'system_id'         => ['required', 'integer', 'exists:systems,id'],
            'priority_id'       => ['required', 'integer', 'exists:priorities,id'],
            'categories'        => ['required', 'array'],
            'categories.*'      => 'integer|exists:categories,id',
            'description'       => ['required', 'string', 'min:10', 'max:510'],
            'attachment'        => ['nullable', 'file', 'mimes:png,jpg,jpeg,pdf', 'max:10240'], // 10MB max
            'recaptcha_token'   => ['required', 'string', new \App\Rules\RecaptchaRule()],
        ];

        // CHECK IF SYSTEM IS "Customer Not Found"
        if ($this->has('system_id')) {
            $system = System::find($this->input('system_id'));
            
            if ($system && $system->system_name === 'Customer Not Found') {
                $rules['store_code'] = ['required', 'string', 'min:3', 'max:50'];
                $rules['store_name'] = ['required', 'string', 'min:3', 'max:100'];
                $rules['store_address'] = ['required', 'string', 'min:10', 'max:510'];
            }
            
            // CHECK IF SYSTEM IS "FSR Online" AND HAS SPECIFIC CATEGORIES
            if ($system && $system->system_name === 'FSR Online') {
                // CHECK IF ANY SELECTED CATEGORY REQUIRES FSR VALIDATION
                $requiresFsrValidation = $this->checkIfRequiresFsrValidation();
                
                if ($requiresFsrValidation) {
                    $rules['fsr_no'] = ['required', 'string', 'min:10', 'max:255'];
                }

                // CHECK IF "Customer Not Found" CATEGORY IS SELECTED
                $requiresStoreFields = $this->checkIfRequiresStoreFields();
                
                if ($requiresStoreFields) {
                    $rules['store_code'] = ['required', 'string', 'min:3', 'max:50'];
                    $rules['store_name'] = ['required', 'string', 'min:3', 'max:100'];
                    $rules['store_address'] = ['required', 'string', 'min:10', 'max:510'];
                }
            }
        }

        return $rules;
    }

    /**
     * CHECK IF ANY SELECTED CATEGORY REQUIRES FSR VALIDATION
     */
    private function checkIfRequiresFsrValidation(): bool
    {
        $categories = $this->input('categories', []);
        
        if (empty($categories)) {
            return false;
        }

        // GET CATEGORY NAMES THAT REQUIRE FSR VALIDATION
        $requiredCategoryNames = [
            'Wrong client input',
            'Wrong service input', 
            'Wrong FSR Number Input',
            'Wrong Ticket Number input',
            'Delete FSR'
        ];

        // GET SELECTED CATEGORIES FROM DATABASE
        $selectedCategories = Category::whereIn('id', $categories)
            ->pluck('category_name')
            ->toArray();

        // CHECK IF ANY SELECTED CATEGORY MATCHES THE REQUIRED ONES
        return !empty(array_intersect($selectedCategories, $requiredCategoryNames));
    }

    /**
     * CHECK IF "Customer Not Found" CATEGORY IS SELECTED (FOR FSR ONLINE)
     */
    private function checkIfRequiresStoreFields(): bool
    {
        $categories = $this->input('categories', []);
        
        if (empty($categories)) {
            return false;
        }

        // GET SELECTED CATEGORIES FROM DATABASE
        $selectedCategories = Category::whereIn('id', $categories)
            ->pluck('category_name')
            ->toArray();

        // CHECK IF "Customer Not Found" CATEGORY IS SELECTED
        return in_array('Customer Not Found', $selectedCategories);
    }

    public function messages(): array
    {
        return [
            'store_code.required' => 'The store code is required for Customer Not Found.',
            'store_code.min' => 'The store code must be at least 3 characters long.',
            'store_code.max' => 'The store code must not exceed 50 characters.',
            'store_name.required' => 'The store name is required for Customer Not Found.',
            'store_name.min' => 'The store name must be at least 3 characters long.',
            'store_name.max' => 'The store name must not exceed 100 characters.',
            'store_address.required' => 'The store address is required for Customer Not Found.',
            'store_address.min' => 'The store address must be at least 10 characters long.',
            'store_address.max' => 'The store address must not exceed 510 characters.',
            'fsr_no.required' => 'The FSR number is required for the selected categories.',
            'fsr_no.min' => 'The FSR number must be at least 10 characters long.',
            'fsr_no.max' => 'The FSR number must not exceed 255 characters.',
        ];
    }
}

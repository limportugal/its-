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
            $normalizedSystemName = $this->normalizeSystemName($system->system_name ?? null);
            
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

            if ($system && $normalizedSystemName === 'powerform') {
                // CHECK IF ACCOUNT LOCKED IS SELECTED (ONLY REQUIRES USERNAME/EMAIL AND COMPANY NUMBER)
                if ($this->checkIfRequiresAccountLockedFields()) {
                    $rules['powerform_email'] = ['required', 'string', 'min:3', 'max:100'];
                    $rules['powerform_company_number'] = ['required', 'string', 'min:11', 'max:255'];
                } 
                // CHECK IF OTHER POWERFORM CATEGORIES ARE SELECTED (REQUIRES ALL FIELDS)
                else if ($this->checkIfRequiresPowerFormFields()) {
                    $rules['powerform_full_name'] = ['required', 'string', 'min:6', 'max:100'];
                    $rules['powerform_employee_id'] = ['required', 'string', 'min:3', 'max:30'];
                    $rules['powerform_email'] = ['required', 'email:rfc,dns', 'min:8', 'max:100'];
                    $rules['powerform_company_number'] = ['required', 'string', 'min:11', 'max:255'];
                    $rules['powerform_imei'] = ['required', 'string', 'min:15', 'max:255'];
                }
            }

            // CHECK IF SYSTEM IS "Service Logs System" AND HAS "Location Error" CATEGORY
            if ($system && $normalizedSystemName === 'servicelogssystem') {
                if ($this->checkIfRequiresServiceLogsFields()) {
                    $rules['service_logs_mobile_no'] = ['required', 'string', 'min:10', 'max:25'];
                    $rules['service_logs_mobile_model'] = ['required', 'string', 'min:3', 'max:100'];
                    $rules['service_logs_mobile_serial_no'] = ['required', 'string', 'min:5', 'max:100'];
                    $rules['service_logs_imei'] = ['required', 'string', 'min:15', 'max:255'];
                }
            }
        }

        return $rules;
    }

    // CHECK IF ANY SELECTED CATEGORY REQUIRES FSR VALIDATION
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

    // CHECK IF "Customer Not Found" CATEGORY IS SELECTED (FOR FSR ONLINE)
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

    // CHECK IF POWER FORM FIELDS ARE REQUIRED
    private function checkIfRequiresPowerFormFields(): bool
    {
        $categories = $this->input('categories', []);

        if (empty($categories)) {
            return false;
        }

        $selectedCategories = Category::whereIn('id', $categories)
            ->pluck('category_name')
            ->map(fn ($name) => strtolower(trim($name)))
            ->toArray();

        $requiredCategoryNames = [
            'forgot password',
            'reset password',
            'unable to login',
            'unable to access',
        ];

        return !empty(array_intersect($selectedCategories, $requiredCategoryNames));
    }

    // CHECK IF ACCOUNT LOCKED FIELDS ARE REQUIRED
    // ONLY RETURNS TRUE IF ACCOUNT LOCKED IS SELECTED AND NO OTHER POWERFORM CATEGORIES ARE SELECTED
    private function checkIfRequiresAccountLockedFields(): bool
    {
        $categories = $this->input('categories', []);

        if (empty($categories)) {
            return false;
        }

        $selectedCategories = Category::whereIn('id', $categories)
            ->pluck('category_name')
            ->map(fn ($name) => strtolower(trim($name)))
            ->toArray();

        $hasAccountLocked = in_array('account locked', $selectedCategories);
        
        // CHECK IF OTHER POWERFORM CATEGORIES ARE SELECTED
        $otherPowerFormCategories = [
            'forgot password',
            'reset password',
            'unable to login',
            'unable to access',
        ];
        
        $hasOtherPowerFormCategories = !empty(array_intersect($selectedCategories, $otherPowerFormCategories));

        // ONLY REQUIRE ACCOUNT LOCKED FIELDS IF ACCOUNT LOCKED IS SELECTED AND NO OTHER POWERFORM CATEGORIES
        return $hasAccountLocked && !$hasOtherPowerFormCategories;
    }

    // CHECK IF SERVICE LOGS FIELDS ARE REQUIRED
    private function checkIfRequiresServiceLogsFields(): bool
    {
        $categories = $this->input('categories', []);

        if (empty($categories)) {
            return false;
        }

        $selectedCategories = Category::whereIn('id', $categories)
            ->pluck('category_name')
            ->map(fn ($name) => strtolower(trim($name)))
            ->toArray();

        return in_array('location error', $selectedCategories);
    }

    // NORMALIZE SYSTEM NAME FOR CONSISTENCY
    private function normalizeSystemName(?string $value): string
    {
        if (!$value) {
            return '';
        }

        return strtolower(preg_replace('/\s+/', '', trim($value)));
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
            'powerform_full_name.required' => 'The full name is required for Power Form tickets.',
            'powerform_full_name.min' => 'The full name must be at least 6 characters long.',
            'powerform_full_name.max' => 'The full name must not exceed 100 characters.',
            'powerform_employee_id.required' => 'The employee ID is required for Power Form tickets.',
            'powerform_employee_id.min' => 'The employee ID must be at least 3 characters long.',
            'powerform_employee_id.max' => 'The employee ID must not exceed 30 characters.',
            'powerform_email.required' => 'The username or email is required.',
            'powerform_email.email' => 'The Power Form email must be a valid email address.',
            'powerform_email.min' => 'The username or email must be at least :min characters long.',
            'powerform_email.max' => 'The username or email must not exceed 100 characters.',
            'powerform_company_number.required' => 'The company number is required for Power Form tickets.',
            'powerform_company_number.min' => 'The company number must be at least 11 characters long.',
            'powerform_company_number.max' => 'The company number must not exceed 255 characters.',
            'powerform_imei.required' => 'The IMEI is required for Power Form tickets.',
            'powerform_imei.min' => 'The IMEI must be at least 15 characters long.',
            'powerform_imei.max' => 'The IMEI must not exceed 255 characters.',
            'service_logs_mobile_no.required' => 'The mobile number is required for Location Error requests.',
            'service_logs_mobile_no.min' => 'The mobile number must be at least 11 characters long.',
            'service_logs_mobile_no.max' => 'The mobile number must not exceed 25 characters.',
            'service_logs_mobile_model.required' => 'The mobile model is required for Location Error requests.',
            'service_logs_mobile_model.min' => 'The mobile model must be at least 2 characters long.',
            'service_logs_mobile_model.max' => 'The mobile model must not exceed 100 characters.',
            'service_logs_mobile_serial_no.required' => 'The mobile serial number is required for Location Error requests.',
            'service_logs_mobile_serial_no.min' => 'The mobile serial number must be at least 5 characters long.',
            'service_logs_mobile_serial_no.max' => 'The mobile serial number must not exceed 100 characters.',
            'service_logs_imei.required' => 'The IMEI is required for Location Error requests.',
            'service_logs_imei.min' => 'The IMEI must be at least 15 characters long.',
            'service_logs_imei.max' => 'The IMEI must not exceed 255 characters.',
        ];
    }
}

<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidateFileUpload implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // If no file is uploaded, skip validation
        if (!$value) {
            return;
        }

        // Check if the uploaded file is valid
        if (!$value->isValid()) {
            $fail('The attachment failed to upload.');
            return;
        }

        // Additional validation can be added here if needed
        // For example, checking file size, type, etc.
        // But this is already handled in the request validation rules
    }
}

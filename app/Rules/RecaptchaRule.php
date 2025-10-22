<?php

namespace App\Rules;

use App\Services\ReCaptchaService;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class RecaptchaRule implements ValidationRule
{
    protected ReCaptchaService $recaptchaService;

    public function __construct()
    {
        $this->recaptchaService = app(ReCaptchaService::class);
    }

    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (empty($value)) {
            $fail('The reCAPTCHA verification is required.');
            return;
        }

        if (!$this->recaptchaService->verify($value)) {
            $fail('reCAPTCHA verification failed. Please try again.');
        }
    }
}

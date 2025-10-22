<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class ReCaptchaService
{
    private string $secretKey;
    private string $verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

    public function __construct()
    {
        $this->secretKey = config('services.recaptcha.secret_key');
    }

    /**
     * Verify reCAPTCHA token
     *
     * @param string $token
     * @param string|null $remoteIp
     * @return bool
     */
    public function verify(string $token, ?string $remoteIp = null): bool
    {
        if (empty($token)) {
            return false;
        }

        try {
            $response = Http::asForm()->post($this->verifyUrl, [
                'secret' => $this->secretKey,
                'response' => $token,
                'remoteip' => $remoteIp ?? request()->ip(),
            ]);

            if (!$response->successful()) {
                return false;
            }

            $data = $response->json();

            if (!isset($data['success']) || !$data['success']) {
                return false;
            }

            // Check score for reCAPTCHA v3 (if applicable)
            if (isset($data['score']) && $data['score'] < 0.5) {
                return false;
            }

            return true;

        } catch (\Exception $e) {
            return false;
        }
    }
}

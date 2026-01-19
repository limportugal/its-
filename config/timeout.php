<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Request Timeouts Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains timeout configurations for different types of requests.
    | Timeouts are set in seconds and help prevent abuse and resource exhaustion.
    |
    | Security considerations:
    | - Authentication requests have longer timeouts due to potential database queries
    | - General requests have shorter timeouts to prevent DoS attacks
    | - Frontend timeouts include buffer time for network latency
    |
    */

    'requests' => [
        'authentication' => [
            'login' => env('AUTH_LOGIN_TIMEOUT', 60),      // 60 seconds for login
            'register' => env('AUTH_REGISTER_TIMEOUT', 45), // 45 seconds for registration
            'password_reset' => env('AUTH_PASSWORD_RESET_TIMEOUT', 30), // 30 seconds for password reset
        ],

        'api' => [
            'general' => env('API_GENERAL_TIMEOUT', 30),    // 30 seconds for general API calls
            'upload' => env('API_UPLOAD_TIMEOUT', 120),     // 2 minutes for file uploads
            'export' => env('API_EXPORT_TIMEOUT', 300),     // 5 minutes for data exports
        ],

        'web' => [
            'general' => env('WEB_GENERAL_TIMEOUT', 30),    // 30 seconds for web requests
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Frontend Timeouts
    |--------------------------------------------------------------------------
    |
    | Frontend timeouts should be slightly longer than backend timeouts
    | to account for network latency and processing time.
    |
    */

    'frontend' => [
        'buffer_seconds' => env('FRONTEND_TIMEOUT_BUFFER', 5), // Additional seconds added to backend timeouts
    ],

    /*
    |--------------------------------------------------------------------------
    | Monitoring and Security
    |--------------------------------------------------------------------------
    |
    | Settings for monitoring slow requests and security measures.
    |
    */

    'monitoring' => [
        'log_slow_requests' => env('LOG_SLOW_REQUESTS', true),
        'slow_request_threshold' => env('SLOW_REQUEST_THRESHOLD', 0.8), // Log requests taking >80% of timeout
    ],

    'security' => [
        'max_concurrent_requests' => env('MAX_CONCURRENT_REQUESTS', 100), // Per IP limit
        'rate_limit_window' => env('RATE_LIMIT_WINDOW', 60), // Seconds
    ],
];

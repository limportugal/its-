<?php

return [
    // Maximum session age in minutes from login time.
    'absolute_timeout' => env('SESSION_ABSOLUTE_TIMEOUT', 720),
    // Seconds before idle expiry when warning dialog should appear.
    'warning_seconds' => env('SESSION_WARNING_SECONDS', 60),
];

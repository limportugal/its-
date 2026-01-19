<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class RequestTimeoutMiddleware
{
    /**
     * Handle an incoming request with secure timeout controls.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $timeoutType  Type of timeout from config (default: 'web.general')
     */
    public function handle(Request $request, Closure $next, string $timeoutType = 'web.general'): Response
    {
        // Get timeout configuration
        $timeoutConfig = config('timeout.requests', []);
        $timeoutSeconds = data_get($timeoutConfig, $timeoutType, 30);

        // Validate timeout is reasonable (between 10-300 seconds)
        $timeoutSeconds = max(10, min(300, $timeoutSeconds));

        // Set PHP execution time limit for security
        $originalTimeLimit = ini_get('max_execution_time');
        set_time_limit($timeoutSeconds);

        // Record start time for monitoring
        $startTime = microtime(true);

        try {
            // Execute the request
            $response = $next($request);

            // Calculate execution time
            $executionTime = microtime(true) - $startTime;

            // Log slow requests for monitoring (configurable threshold)
            $slowThreshold = config('timeout.monitoring.slow_request_threshold', 0.8);
            if (config('timeout.monitoring.log_slow_requests', true) &&
                $executionTime > ($timeoutSeconds * $slowThreshold)) {
                Log::warning('Slow request detected', [
                    'url' => $request->fullUrl(),
                    'method' => $request->method(),
                    'execution_time' => round($executionTime, 2),
                    'timeout_limit' => $timeoutSeconds,
                    'timeout_type' => $timeoutType,
                    'ip' => $request->ip(),
                ]);
            }

            // Add security headers
            $response->headers->set('X-Request-Time', round($executionTime * 1000) . 'ms');
            $response->headers->set('X-Timeout-Limit', $timeoutSeconds . 's');
            $response->headers->set('X-Timeout-Type', $timeoutType);

            return $response;

        } catch (\Throwable $e) {
            // Log timeout or execution errors
            $executionTime = microtime(true) - $startTime;

            Log::error('Request timeout or execution error', [
                'url' => $request->fullUrl(),
                'method' => $request->method(),
                'execution_time' => round($executionTime, 2),
                'timeout_limit' => $timeoutSeconds,
                'timeout_type' => $timeoutType,
                'error' => $e->getMessage(),
                'ip' => $request->ip(),
            ]);

            // Return appropriate error response
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Request timeout or execution error',
                    'error' => 'TIMEOUT_ERROR',
                    'timeout_seconds' => $timeoutSeconds
                ], 408); // Request Timeout
            }

            // For web requests, show error page
            return response()->view('errors.timeout', [
                'message' => 'The request took too long to process. Please try again.',
                'timeout' => $timeoutSeconds,
                'timeout_type' => $timeoutType
            ], 408);

        } finally {
            // Always restore original time limit
            set_time_limit($originalTimeLimit);
        }
    }
}

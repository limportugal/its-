<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateUuidMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if route exists and has parameters
        if ($request->route() && $request->route()->parameters()) {
            // Get all route parameters
            $routeParams = $request->route()->parameters();
            
            // Check if any parameter is named 'uuid' or contains 'uuid' in the name
            foreach ($routeParams as $paramName => $paramValue) {
                if (strpos($paramName, 'uuid') !== false || $paramName === 'uuid') {
                    // Validate UUID format
                    if (!$this->isValidUuid($paramValue)) {
                        abort(404, 'Invalid UUID format');
                    }
                }
            }
        }
        
        return $next($request);
    }
    
    /**
     * Check if the given string is a valid UUID
     */
    private function isValidUuid(string $uuid): bool
    {
        return preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $uuid) === 1;
    }
}

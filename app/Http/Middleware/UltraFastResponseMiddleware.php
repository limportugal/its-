<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UltraFastResponseMiddleware
{
    /**
     * Handle an incoming request with ultra-fast optimizations.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        
        // ADD ULTRA-FAST RESPONSE HEADERS
        $response->headers->set('Cache-Control', 'public, max-age=300'); // 5 MINUTES CACHE
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        
        // ENABLE COMPRESSION FOR JSON RESPONSES
        if ($request->wantsJson() || 
            $request->is('api/*') || 
            $request->is('userlogs/*') || 
            $request->is('tickets/*/data') ||  // ALL TICKET DATA ENDPOINTS (closed, pending, cancelled, deleted)
            $request->is('users/*') ||         // USER MANAGEMENT ENDPOINTS
            $request->is('profile/*') ||       // PROFILE ENDPOINTS
            $request->is('dashboard/*')) {     // DASHBOARD ENDPOINTS
            $response->headers->set('Content-Encoding', 'gzip');
            $response->headers->set('Vary', 'Accept-Encoding');
        }
        
        return $response;
    }
}

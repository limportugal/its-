<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnforceSessionSecurity
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! Auth::check()) {
            return $next($request);
        }

        $now = now()->timestamp;
        $startedAt = (int) $request->session()->get('session_started_at', $now);

        $request->session()->put('session_started_at', $startedAt);
        $request->session()->put('last_activity_at', $now);

        return $next($request);
    }
}

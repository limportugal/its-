<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
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
        $lastActivityAt = (int) $request->session()->get('last_activity_at', $now);
        $idleLimitSeconds = max((int) config('session.lifetime', 30), 1) * 60;
        $absoluteLimitSeconds = max((int) config('session_security.absolute_timeout', 720), 1) * 60;

        $idleExpired = ($now - $lastActivityAt) >= $idleLimitSeconds;
        $absoluteExpired = ($now - $startedAt) >= $absoluteLimitSeconds;

        if ($idleExpired || $absoluteExpired) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return $this->buildExpiredResponse($request, $idleExpired);
        }

        $request->session()->put('session_started_at', $startedAt);
        $request->session()->put('last_activity_at', $now);

        return $next($request);
    }

    private function buildExpiredResponse(Request $request, bool $idleExpired): RedirectResponse|JsonResponse
    {
        $message = $idleExpired
            ? 'Session ended due to inactivity. Please log in again.'
            : 'Session ended due to security policy. Please log in again.';

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'success' => false,
                'message' => $message,
                'redirect' => route('home'),
            ], 401);
        }

        return redirect()->route('home')->with('warning', $message);
    }
}

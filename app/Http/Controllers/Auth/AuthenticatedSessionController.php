<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use App\Models\UserLogs;
use Illuminate\Support\Facades\Route;

class AuthenticatedSessionController extends Controller
{
    // LOGIN PAGE
    public function create(): Response
    {

        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
        ]);
    }

    // LOGIN REQUEST
    public function store(LoginRequest $request): RedirectResponse|JsonResponse
    {
        // SET MAX ATTEMPTS AND LOCKOUT TIME
        $maxAttempts = 5;
        $lockoutTime = 5 * 60;
        $rateKey = 'login:' . strtolower($request->email);

        // GET USER BY EMAIL FIRST
        $user = User::where('email', $request->email)->first();

        if (!session()->has('active_role') && $user) {
            $firstRole = $user->roles->first();
            if ($firstRole) {
                session(['active_role' => $firstRole->name]);
            }
        }

        // CHECK IF USER IS ACTIVE
        if ($user && strtolower($user->status) !== 'active') {
            return back()->withErrors([
                'auth' => 'Your account is not active. Please contact the administrator.'
            ]);
        }

        // CHECK IF RATE LIMITER IS ATTEMPTED
        if (RateLimiter::remaining($rateKey, $maxAttempts) < $maxAttempts) {
            $lastAttemptTime = RateLimiter::availableIn($rateKey);

            // IF 10 MINUTES HAS PASSED, CLEAR THE RATE LIMITER
            if ($lastAttemptTime <= ($lockoutTime - (2 * 60))) {
                RateLimiter::clear($rateKey);
            }
        }

        // CHECK IF RATE LIMITER IS ATTEMPTED
        if (RateLimiter::tooManyAttempts($rateKey, $maxAttempts)) {
            $minutesUntilUnlock = ceil(RateLimiter::availableIn($rateKey) / 60);

            if ($request->wantsJson()) {
                return response()->json([
                    'message' => "Too many login attempts. Try again in {$minutesUntilUnlock} minutes."
                ], 429);
            }

            return back()->withErrors([
                'auth' => "Too many login attempts. Try again in {$minutesUntilUnlock} minutes."
            ]);
        }

        // CHECK CREDENTIALS - User was already queried above, reuse it
        if (!$user || !Hash::check($request->password, $user->password)) {
            RateLimiter::hit($rateKey, $lockoutTime);

            // GET REMAINING ATTEMPTS
            $remainingAttempts = RateLimiter::remaining($rateKey, $maxAttempts);

            if ($request->wantsJson()) {
                return response()->json([
                    'message' => "Invalid credentials. You have {$remainingAttempts} attempts left before lockout."
                ], 401);
            }

            return back()->withErrors([
                'auth' => "Invalid credentials. You have {$remainingAttempts} attempts left before lockout."
            ]);
        }

        // CLEAR RATE LIMITER
        RateLimiter::clear($rateKey);

        $request->authenticate();
        $request->session()->regenerate();
        $request->session()->put('session_started_at', now()->timestamp);
        $request->session()->put('last_activity_at', now()->timestamp);

        UserLogs::logActivity("{$user->name}, has successfully logged in.", $user->id);
        session()->flash('success', 'Welcome back! You have successfully logged in.');

        // Handle JSON API response
        if ($request->wantsJson()) {
            $response = response()->json([
                'success' => true,
                'message' => 'Login successful',
                'data' => []
            ]);
        } else {
            // HANDLE WEB RESPONSE
            $response = redirect()->intended(route('tickets.indexPendingTickets', absolute: false))->with([
                'refresh' => true,
            ]);
        }

        return $response;
    }

    // LOGOUT REQUEST 
    public function destroy(Request $request): RedirectResponse|JsonResponse
    {
        $user = Auth::user();

        // LOG ACTIVITY
        if ($user) {
            UserLogs::logActivity("{$user->name}, has successfully logged out.", $user->id);
        }

        // Logout the user
        Auth::guard('web')->logout();
        
        // Invalidate the session and regenerate CSRF token
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // ADD HEADERS TO CLEAR ALL CACHED DATA
        $headers = [
            'Cache-Control' => 'no-cache, no-store, must-revalidate, max-age=0',
            'Pragma' => 'no-cache',
            'Expires' => '0',
            'Clear-Site-Data' => '"cache", "cookies", "storage"',
        ];

        // If it's an AJAX/JSON request (from frontend fetch), return JSON response
        // Frontend will handle the full reload immediately after logout
        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Logout successful',
            ], 200, $headers);
        }

        // For regular form submissions, redirect as usual
        $response = redirect('/');
        foreach ($headers as $key => $value) {
            $response->headers->set($key, $value);
        }

        return $response;
    }
}

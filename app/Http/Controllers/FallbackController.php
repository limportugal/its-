<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FallbackController extends Controller
{
    public function handle(Request $request)
    {
        // FOR JSON REQUESTS, RETURN A JSON RESPONSE
        if ($request->expectsJson() || $request->wantsJson()) {
            return response()->json([
                'message' => 'Route not found.',
                'error' => 'Not Found',
                'status' => 404,
            ], 404);
        }
        
        // SPECIAL CASE: HOMEPAGE
        if ($request->path() === '/') {
            // IF AUTHENTICATED, REDIRECT TO DASHBOARD
            if (Auth::check()) {
                return redirect()->route('dashboard.index');
            }
            // IF NOT AUTHENTICATED, SHOW HOME PAGE
            return redirect()->route('home');
        }
        
        // CHECK IF THE REQUEST HAS UUID PARAMETERS AND VALIDATE THEM
        $pathSegments = explode('/', trim($request->path(), '/'));
        foreach ($pathSegments as $segment) {
            if ($this->looksLikeUuid($segment) && !$this->isValidUuid($segment)) {
                // Invalid UUID detected, show 404
                return $this->showError($request, 404);
            }
        }
        
        // FOR AUTHENTICATED USERS, SHOW PROPER 404
        if (Auth::check()) {
            if ($request->header('X-Inertia')) {
                return Inertia::render('Errors/404', [
                    'status' => 404,
                    'message' => 'The page you are looking for could not be found.',
                ])->toResponse($request)->setStatusCode(404);
            }
            return response()->view('errors.404')->setStatusCode(404);
        }
        
        // FOR UNAUTHENTICATED USERS, SHOW 404 PAGE
        return response()->view('errors.404')->setStatusCode(404);
    }

    public function showError(Request $request, $code = 404)
    {
        $errorData = $this->getErrorData($code);
        
        // FOR JSON REQUESTS, RETURN A JSON RESPONSE
        if ($request->expectsJson() || $request->wantsJson()) {
            return response()->json([
                'message' => $errorData['message'],
                'error' => $errorData['title'],
                'status' => $code,
            ], $code);
        }
        
        // FOR AUTHENTICATED USERS, SHOW PROPER ERROR PAGE
        if (Auth::check()) {
            if ($request->header('X-Inertia')) {
                return Inertia::render("Errors/{$code}", [
                    'status' => $code,
                    'title' => $errorData['title'],
                    'message' => $errorData['message'],
                ])->toResponse($request)->setStatusCode($code);
            }
            return response()->view("errors.{$code}", [
                'status' => $code,
                'title' => $errorData['title'],
                'message' => $errorData['message'],
            ])->setStatusCode($code);
        }
        
        // FOR UNAUTHENTICATED USERS, STILL SHOW ERROR PAGE
        return response()->view("errors.{$code}", [
            'status' => $code,
            'title' => $errorData['title'],
            'message' => $errorData['message'],
        ])->setStatusCode($code);
    }

    private function getErrorData($code)
    {
        $errors = [
            403 => [
                'title' => 'Access Forbidden',
                'message' => 'You don\'t have permission to access this resource. Please contact your administrator if you believe this is an error.',
            ],
            404 => [
                'title' => 'Page Not Found',
                'message' => 'The page you are looking for is not available in our system records. Let\'s get you back to your dashboard!',
            ],
            408 => [
                'title' => 'Request Timeout',
                'message' => 'Your request took too long to process. Please try again or contact support if the problem persists.',
            ],
            500 => [
                'title' => 'Internal Server Error',
                'message' => 'Something went wrong on our end. Our team has been notified and is working to fix this issue.',
            ],
            503 => [
                'title' => 'Service Unavailable',
                'message' => 'The service is temporarily unavailable due to maintenance. Please try again in a few minutes.',
            ],
        ];

        return $errors[$code] ?? [
            'title' => 'Error',
            'message' => 'An unexpected error occurred. Please try again later.',
        ];
    }
    
    /**
     * Check if a string looks like a UUID (has the right format)
     */
    private function looksLikeUuid(string $string): bool
    {
        return preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $string) === 1 ||
               preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{11}$/i', $string) === 1; // For truncated UUIDs
    }
    
    /**
     * Check if a string is a valid UUID
     */
    private function isValidUuid(string $uuid): bool
    {
        return preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $uuid) === 1;
    }
}

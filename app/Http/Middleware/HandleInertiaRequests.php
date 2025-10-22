<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            
            // ✅ CSRF TOKEN FOR FRONTEND REQUESTS
            'csrf_token' => csrf_token(),
            
            // ✅ LOGIN FLASH MESSAGES
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
            
            // ✅ USER ROLES FOR DRAWER MENU ACCESS
            'userRoles' => $request->user() ? $request->user()->roles->pluck('name')->toArray() : [],
        ];
    }
}

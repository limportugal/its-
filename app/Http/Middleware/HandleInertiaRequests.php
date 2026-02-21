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
            'csrf_token' => csrf_token(),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
            'session' => [
                'lifetime_minutes' => (int) config('session.lifetime', 30),
                'warning_seconds' => (int) config('session_security.warning_seconds', 60),
            ],
            'userRoles' => $request->user() ? $request->user()->roles->pluck('name')->toArray() : [],
        ];
    }
}

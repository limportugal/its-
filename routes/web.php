<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FallbackController;

// IMPORT ALL ROUTE FILES
require __DIR__ . '/home-s3.php';
require __DIR__ . '/public.php';

// AUTHENTICATED ROUTES
Route::middleware(['auth', 'session.security'])->group(function () {
    // DASHBOARD - Super Admin, Admin, Support Agent, Manager, Team Leader
    Route::middleware(['role:Super Admin|Admin|Support Agent|Manager|Team Leader'])->group(function () {
        require __DIR__ . '/dashboard.php';
    });

    // TICKETS - Super Admin, Admin, Support Agent, Manager, Team Leader
    Route::middleware(['role:Super Admin|Admin|Support Agent|Manager|Team Leader'])->group(function () {
        require __DIR__ . '/tickets.php';
        require __DIR__ . '/user-logs.php';
    });

    // SUPERADMIN/ADMIN/MANAGER FOR CRUD MAINTENANCE ROUTES
    Route::middleware(['role:Super Admin|Admin|Manager'])->group(function () {
        require __DIR__ . '/users.php';
        require __DIR__ . '/maintenance.php';
    });

    // PROFILE ROUTES - ALL AUTHENTICATED USERS
    require __DIR__ . '/profile.php';
    
    // SUPER ADMIN ONLY - ROLES AND PERMISSIONS
    Route::middleware(['role:Super Admin'])->group(function () {
        require __DIR__ . '/roles-permissions.php';
    });
});

// DO NOT REMOVE THIS CODE
require __DIR__ . '/auth.php';

// ERROR ROUTES
Route::get('/error/{code}', [FallbackController::class, 'showError'])->name('error.show');

// FALLBACK ROUTE
Route::fallback([FallbackController::class, 'handle']);

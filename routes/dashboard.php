<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Middleware\RoleRedirectMiddleware;

Route::name('dashboard.')->group(function () {
    Route::middleware(['role:Super Admin|Admin|Manager'])->group(function () {
    Route::controller(DashboardController::class)->prefix('dashboard')->group(function () {
        Route::get('/', 'index')->name('index');
            Route::get('/data', 'showTicketSummary')->name('showTicketSummary');
        });
    });
});

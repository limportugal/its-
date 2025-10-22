<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RBAC\RoleAndPermissionController;
use App\Http\Controllers\RBAC\RoleController;
use App\Http\Controllers\RBAC\PermissionController;

// ROLES AND PERMISSIONS
Route::prefix('roles-and-permissions')->group(function () {
    Route::get('/', [RoleAndPermissionController::class, 'index'])->name('roles-and-permissions.index');

    // ROLES
    Route::prefix('roles')->controller(RoleController::class)->group(function () {
        Route::get('/', 'index')->name('roles.index'); 
        Route::get('/data-roles', 'show')->name('roles.show');
        Route::post('/create-role', 'store')->name('roles.store');
        Route::get('/permissions', 'getAllPermissions');
        Route::get('/{id}/permissions', 'getPermissions')->name('roles.permissions');
        Route::put('/update-role/{id}', 'update')->name('roles.update');
        Route::delete('/delete-role/{id}', 'destroy')->name('roles.destroy');
    });

    // PERMISSIONS
    Route::prefix('permissions')->controller(PermissionController::class)->group(function () {
        Route::get('/', 'index')->name('permissions.index');
        Route::get('/data-permissions', 'show')->name('permissions.show'); 
        Route::post('/create-permission', 'store')->name('permissions.store');
        Route::put('/update-permission/{id}', 'update')->name('permissions.update');
        Route::delete('/delete-permission/{id}', 'destroy')->name('permissions.destroy');
    });
});

<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Maintenance\MaintenanceController;
use App\Http\Controllers\Maintenance\ServiceCenterController;
use App\Http\Controllers\Maintenance\PriorityController;
use App\Http\Controllers\Maintenance\SystemController;
use App\Http\Controllers\Maintenance\CategoryController;
use App\Http\Controllers\Maintenance\CompanyController;
use App\Http\Controllers\Maintenance\OwnershipController;
use App\Http\Controllers\Maintenance\StoreTypeController;

// MAINTENANCE (SUPERADMIN/ADMIN ONLY)
Route::name('maintenance.')->group(function () {
    Route::get('/maintenance', [MaintenanceController::class, 'index'])->name('index');

    // SERVICE CENTERS
    Route::controller(ServiceCenterController::class)->prefix('maintenance/service-centers')->group(function () {
        Route::get('', 'index')->name('service-centers.index');
        Route::get('/data', 'show')->name('service-centers.show');
        Route::post('/create', 'create')->name('service-centers.create');
        Route::put('/update/{id}', 'update')->name('service-centers.update');
        Route::patch('/activate/{id}', 'activate')->name('service-centers.activate');
        Route::patch('/inactivate/{id}', 'inactivate')->name('service-centers.inactivate');
        Route::delete('/delete/{id}', 'destroy')->name('service-centers.delete');
    });

    // PRIORITIES
    Route::controller(PriorityController::class)->prefix('maintenance/priorities')->group(function () {
        Route::get('', 'index')->name('priorities.index');
        Route::get('/data', 'show')->name('priorities.show');
        Route::post('/create', 'create')->name('priorities.create');
        Route::put('/update/{id}', 'update')->name('priorities.update');
        Route::patch('/activate/{id}', 'activate')->name('priorities.activate');
        Route::patch('/inactivate/{id}', 'inactivate')->name('priorities.inactivate');
        Route::delete('/delete/{id}', 'destroy')->name('priorities.delete');
    });

    // SYSTEMS
    Route::controller(SystemController::class)->prefix('maintenance/systems')->group(function () {
        Route::get('', 'index')->name('systems.index');
        Route::get('/data', 'show')->name('systems.show');
        Route::get('/{systemName}/{systemUuid}/categories/data', 'showCategories')->name('systems.categories');
        Route::post('/create', 'create')->name('systems.create');
        Route::put('/update/{id}', 'update')->name('systems.update');
        Route::patch('/activate/{id}', 'activate')->name('systems.activate');
        Route::patch('/inactivate/{id}', 'inactivate')->name('systems.inactivate');
        Route::delete('/delete/{id}', 'destroy')->name('systems.delete');
    });

    // SYSTEM CATEGORIES PAGE
    Route::get('/maintenance/systems/{systemName}/{systemUuid}/categories', function ($systemName, $systemUuid) {
        return inertia('Maintenance/Categories/IndexSystemCategories', compact('systemName', 'systemUuid'));
    })->name('systems.categories.page');

    // CATEGORIES
    Route::controller(CategoryController::class)->prefix('maintenance/categories')->group(function () {
        Route::get('/data', 'show')->name('categories.show');
        Route::post('/create', 'create')->name('categories.create');
        Route::put('/update/{id}', 'update')->name('categories.update');
        Route::patch('/activate/{id}', 'activate')->name('categories.activate');
        Route::patch('/inactivate/{id}', 'inactivate')->name('categories.inactivate');
        Route::delete('/delete/{id}', 'destroy')->name('categories.delete');
    });

    // COMPANIES
    Route::controller(CompanyController::class)->prefix('maintenance/companies')->group(function () {
        Route::get('', 'index')->name('companies.index');
        Route::get('/data', 'show')->name('companies.show');
        Route::post('/create', 'create')->name('companies.create');
        Route::put('/update/{id}', 'update')->name('companies.update');
        Route::patch('/activate/{id}', 'activate')->name('companies.activate');
        Route::patch('/inactivate/{id}', 'inactivate')->name('companies.inactivate');
        Route::delete('/delete/{id}', 'destroy')->name('companies.delete');
    });

    // OWNERSHIPS
    Route::controller(OwnershipController::class)->prefix('maintenance/ownerships')->group(function () {
        Route::get('', 'index')->name('ownerships.index');
        Route::get('/data', 'show')->name('ownerships.show');
        Route::post('/create', 'create')->name('ownerships.create');
        Route::put('/update/{id}', 'update')->name('ownerships.update');
        Route::patch('/activate/{id}', 'activate')->name('ownerships.activate');
        Route::patch('/inactivate/{id}', 'inactivate')->name('ownerships.inactivate');
        Route::delete('/delete/{id}', 'destroy')->name('ownerships.delete');
    });

    // STORE TYPES
    Route::controller(StoreTypeController::class)->prefix('maintenance/store-types')->group(function () {
        Route::get('', 'index')->name('store-types.index');
        Route::get('/data', 'show')->name('store-types.show');
        Route::post('/create', 'create')->name('store-types.create');
        Route::put('/update/{id}', 'update')->name('store-types.update');
        Route::patch('/activate/{id}', 'activate')->name('store-types.activate');
        Route::patch('/inactivate/{id}', 'inactivate')->name('store-types.inactivate');
        Route::delete('/delete/{id}', 'destroy')->name('store-types.delete');
    });
});

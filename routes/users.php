<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\UserController;

Route::controller(UserController::class)->prefix('users')->group(function () {
    Route::get('/active', 'indexActiveUsers')->name('users.active-users.index');
    Route::get('/inactive', 'indexInactiveUsers')->name('users.inactive-users.index');
    Route::get('/active/data', 'showActiveUsersData')->name('users.showActiveUsersData');
    Route::get('/inactive/data', 'showInactiveUsersData')->name('users.showInactiveUsersData');
    Route::get('/avatars', 'getUsersImage')->name('users.getUsersImage');
    Route::post('/create', 'create')->name('users.create');
    Route::put('/update/{uuid}', 'update')->name('users.update');
    Route::patch('/activate/{uuid}', 'activateUser')->name('users.activate');
    Route::patch('/deactivate/{uuid}', 'deactivateUser')->name('users.deactivate');
    Route::patch('/delete/{uuid}', 'deleteUser')->name('users.delete');
    Route::get('/roles-dropdown', 'UserRoleDropdown')->name('users.rolesDropdown');
    Route::get('/update-roles-dropdown', 'UpdateUserRoleDropdown')->name('users.updateRolesDropdown');
    Route::get('/companies-dropdown', 'UserCompanyDropdown')->name('users.companiesDropdown');
    Route::get('/team-leaders-dropdown', 'TeamLeaderDropdown')->name('users.teamLeadersDropdown');
}); 

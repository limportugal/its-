<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\ProfileController;
use App\Http\Middleware\RoleRedirectMiddleware;

// PROFILE ROUTES
Route::controller(ProfileController::class)->name('profile.')->middleware('auth')->group(function () {
    Route::get('/profile', 'edit')->name('index');
    Route::get('/profile/data', 'getPersonalProfileData')->name('getPersonalProfileData');
    Route::post('/profile/picture', 'uploadProfilePicture')->name('uploadPicture');
    Route::delete('/profile/picture', 'deleteProfilePicture')->name('deletePicture');
});

// SUPER ADMIN, ADMIN, MANAGER CAN VIEW OTHER USERS' PROFILE
Route::controller(ProfileController::class)->name('profile.')->middleware([RoleRedirectMiddleware::class . ':Super Admin,Admin,Manager,Branch Head'])->group(function () {
    Route::get('/profile/data/{uuid}', 'getProfileDataByUuid')->name('getProfileDataByUuid');
    Route::get('/profile/{uuid}', 'showByUuid')->name('showByUuid');
    Route::patch('/profile/update/{uuid}', 'update')->name('update');
    Route::post('/profile/picture/{uuid}', 'uploadProfilePictureByUuid')->name('uploadPictureByUuid');
    Route::delete('/profile/picture/{uuid}', 'deleteProfilePictureByUuid')->name('deletePictureByUuid');
});

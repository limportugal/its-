<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeAndS3\HomeController;
use App\Http\Controllers\HomeAndS3\S3Controller;

// WELCOME/HOME ROUTE
Route::get('/', [HomeController::class, 'home'])->name('home');

// S3 ATTACHMENTS
Route::controller(S3Controller::class)->group(function () {
    Route::get('/attachments/{year}/{month}/{date}/{file}', 'show');
    Route::get('/attachment/{uuid}', 'showByUuid')->name('attachment.show');
});

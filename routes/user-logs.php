<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\UserLogsController;

// USER LOGS
Route::controller(UserLogsController::class)->prefix('userlogs')->name('userlogs.')->group(function () {
    Route::get('', 'index')->name('index');
    Route::get('/data', 'show')->name('data');
    Route::get('/ticket/{ticketNumber}', 'getUserLogsByTicketNumber')->name('getUserLogsByTicketNumber');
});

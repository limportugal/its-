<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Ticket\TicketController;

// CSRF token route for SPA/AJAX requests (guest + auth)
Route::get('/csrf-token', function () {
    request()->session()->regenerateToken();

    return response()->json(
        ['csrf_token' => csrf_token()],
        200,
        [
            'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]
    );
})->name('csrf-token');

// GUEST ROUTES
Route::middleware('guest')->group(function () {
    // REGISTER & LOGIN ROUTES
    Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store'])->middleware('timeout:authentication.login'); // Configurable timeout for login

    // PASSWORD RESET ROUTES
    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])->name('password.request');
    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])->name('password.email');
    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])->name('password.reset');
    Route::post('reset-password', [NewPasswordController::class, 'store'])->name('password.store');

    // CREATE PASSWORD ROUTES
    Route::get('password/create/{user}', [PasswordController::class, 'showCreateForm'])->name('password.create');
    Route::post('password/store/{user}', [PasswordController::class, 'storeNewPassword'])->name('password.create.store');

    // GUEST RESUBMISSION ROUTES
    Route::get('/ticket/resubmit/{uuid}', [TicketController::class, 'showResubmitPage'])->name('ticket.resubmit.view');
    Route::post('/ticket/resubmit/{uuid}', [TicketController::class, 'resubmitTicket'])->name('ticket.resubmit');

    // GUEST FOLLOW-UP ROUTES
    Route::get('/ticket/follow-up/{uuid}', [TicketController::class, 'showFollowUpPage'])->name('ticket.followUp.view');
    Route::patch('/ticket/follow-up/{uuid}', [TicketController::class, 'followUpTicketByClient'])->name('ticket.followUp');
});

// AUTHENTICATED ROUTES
Route::middleware(['auth', 'session.security'])->group(function () {
    // EMAIL VERIFICATION ROUTES
    Route::get('verify-email', EmailVerificationPromptController::class)->name('verification.notice');
    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)->middleware(['signed', 'throttle:6,1'])->name('verification.verify');
    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])->middleware('throttle:6,1')->name('verification.send');

    // CONFIRM PASSWORD ROUTES
    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])->name('password.confirm');
    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    // UPDATE PASSWORD ROUTES
    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    // LOGOUT ROUTE
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});

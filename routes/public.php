<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Ticket\CreateTicketController;

// PUBLIC ROUTES
Route::controller(CreateTicketController::class)->prefix('ticket')->group(function () {
    Route::post('/create', 'createTicket')->name('public.tickets.create');
    Route::get('/priorities', 'showTicketPriorities')->name('public.tickets.priorities');
    Route::get('/service-centers', 'serviceCenterDropdown')->name('public.tickets.service-centers');
    Route::get('/systems', 'systemDropdown')->name('public.tickets.systems');
    Route::get('/categories/by-system/{systemId}', 'showTicketCategoriesBySystem')->name('public.tickets.categories.by-system');
});

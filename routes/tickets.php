<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Ticket\TicketController;
use App\Http\Middleware\RoleRedirectMiddleware;

Route::name('tickets.')->group(function () {
    Route::controller(TicketController::class)->prefix('tickets')->group(function () {
        Route::get('pending', 'indexPendingTickets')->name('indexPendingTickets');
        Route::get('pending/data', 'showPendingTickets')->name('showPendingTickets');
        Route::get('pending/{uuid}', 'viewPendingTicketByUuid')->name('viewPendingTicketByUuid');
        Route::get('pending/data/{uuid}', 'getViewPendingTicketData')->name('getViewPendingTicketData');
        Route::put('/update/{uuid}', 'update')->name('updatePendingTicket');
        
        // DELETE TICKET
        Route::patch('/delete/{uuid}', 'deleteTicket')->name('deleteTicket');
        
        // ASSIGN TICKET TO USER
        Route::put('assign-ticket/{ticket_uuid}', 'assignTicketToUser')->name('assignTicketToUser');
        
        // GET USERS FOR DROPDOWN
        Route::get('users-dropdown', 'getUsersDropdown')->name('getUsersDropdown');
        
        // RETURN TICKET
        Route::post('return/{ticket_uuid}', 'returnTicket')->name('returnTicketByUuid');
        
        // CANCEL TICKET
        Route::patch('cancel/{uuid}', 'cancelTicket')->name('cancelTicketByUuid');
        
        // REMIND CLIENT
        Route::patch('remind-client/{uuid}', 'remindClient')->name('remindClientByUuid');
        
        // REOPEN TICKET
        Route::patch('reopen/{uuid}', 'reopenTicketByUuid')->name('reopenTicketByUuid');
        
        
        // CANCELLED TICKETS
        Route::get('cancelled', 'indexCancelledTickets')->name('indexCancelledTickets');
        Route::get('cancelled/data', 'showCancelledTickets')->name('showCancelledTickets');
        Route::get('cancelled-ticket/{uuid}', 'viewCancelledTicketByUuid')->name('viewCancelledTicketByUuid');
        Route::get('cancelled-ticket/data/{uuid}', 'showCancelledTicketByUuid')->name('showCancelledTicketByUuid');
        
        // CLOSED TICKETS
        Route::get('closed', 'indexClosedTickets')->name('indexClosedTickets');
        Route::get('closed/data', 'showClosedTickets')->name('showClosedTickets');
        Route::get('closed-ticket/{uuid}', 'viewClosedTicketByUuid')->name('viewClosedTicketByUuid');
        Route::get('closed-ticket/data/{uuid}', 'showClosedTicketByUuid')->name('showClosedTicketByUuid');
    });

    // DELETED TICKETS - SUPER ADMIN ONLY
    Route::middleware(['role:Super Admin'])->group(function () {
        Route::controller(TicketController::class)->prefix('tickets')->group(function () {
            Route::get('deleted', 'indexDeletedTickets')->name('indexDeletedTickets');
            Route::get('deleted/data', 'showDeletedTickets')->name('showDeletedTickets');
            Route::get('deleted-ticket/{uuid}', 'viewDeletedTicketByUuid')->name('viewDeletedTicketByUuid');
            Route::get('deleted-ticket/data/{uuid}', 'getViewDeletedTicketData')->name('getViewDeletedTicketData');
            Route::patch('restore/{uuid}', 'restoreTicketByUuid')->name('restoreTicketByUuid');
        });
    });
});




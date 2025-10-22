<?php

namespace App\Services\Ticket;

use App\Models\Ticket;
use App\Models\UserLogs;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;

class DeleteTicketService
{
    use AuthorizesRequests;
    public function deleteTicket(string $uuid)
    {
        $ticket = Ticket::where('uuid', $uuid)->firstOrFail();
        $this->authorize('delete', $ticket);
        $ticket->status = 'deleted';
        $ticket->deleted_at = now();
        $ticket->deleted_ticket_by_id = request()->user()->id;
        $ticket->save();

        // LOG ACTIVITY
        UserLogs::logActivity("Ticket has been moved to trash.", Auth::id(), $ticket->ticket_number);
        return $ticket;
    }
}

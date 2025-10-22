<?php

namespace App\Services\Ticket;

use App\Jobs\SendTicketCancelledEmail;
use App\Models\CancellationReason;
use App\Models\Ticket;
use App\Models\UserLogs;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class CancelTicketService
{
    use AuthorizesRequests;

    public function cancelTicket(Request $request, $uuid)
    {
        return DB::transaction(function () use ($request, $uuid) {
            $user = request()->user();
            $ticket = Ticket::where('uuid', $uuid)->firstOrFail();
            
            $this->authorize('cancel', $ticket);

            // SAVE ORIGINAL TICKET DATA FOR RESPONSE
            $cancelTicket = $ticket->toArray();

            // UPDATE TICKET FIELDS
            $ticket->update([
                'status' => 'cancelled',
                'cancelled_ticket_by_id' => $user->id,
                'cancelled_at' => now(),
            ]);

            // CREATE CANCELLATION REASON RECORD
            $cancellationReason = CancellationReason::create([
                'ticket_id' => $ticket->id,
                'reason_text' => $request->input('cancellation_reason'),
                'cancelled_by_id' => $user->id,
                'cancelled_at' => now(),
            ]);

            // LOG ACTIVITY
            UserLogs::logActivity("Ticket has been cancelled. CANCELLED REASON: {$cancellationReason->reason_text}.", Auth::id(), $ticket->ticket_number);

            // SEND EMAIL NOTIFICATION (outside transaction to avoid rollback on email failure)
            if ($ticket->email) {
                SendTicketCancelledEmail::dispatch($ticket);
            }

            // RETURN RESPONSE
            return $cancelTicket;
        });
    }
}

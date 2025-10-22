<?php

namespace App\Services\Ticket;

use App\Jobs\ReminderTicketEmail;
use App\Models\TicketReminderReason;
use App\Models\Ticket;
use App\Models\UserLogs;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RemindClientTicket
{
    use AuthorizesRequests;

    public function remindClient(Request $request, $uuid)
    {
        return DB::transaction(function () use ($request, $uuid) {
            $user = request()->user();
            $ticket = Ticket::where('uuid', $uuid)->firstOrFail();
            
            $this->authorize('remindClient', $ticket);

            // SAVE ORIGINAL TICKET DATA FOR RESPONSE
            $remindTicket = $ticket->toArray();

            // UPDATE TICKET FIELDS
            $ticket->update([
                'status' => 'reminder',
                'reminded_by_id' => $user->id,
                'reminded_at' => now(),
            ]);

            // CREATE REMINDER REASON RECORD
            $reminderReason = TicketReminderReason::create([
                'ticket_id' => $ticket->id,
                'reason_text' => $request->input('reminder_reason'),
                'reminded_by_id' => $user->id,
                'reminded_at' => now(),
            ]);

            // LOG ACTIVITY
            $remindByName = Auth::user()->name ?? 'Unknown User';
            $user = Auth::user();
            $roleName = $user->roles->first()->name ?? 'Unknown Role';
            UserLogs::logActivity("Reminder sent to ticket creator. REMINDER REASON: {$reminderReason->reason_text}.", Auth::id(), $ticket->ticket_number);

            // SEND EMAIL NOTIFICATION
            ReminderTicketEmail::dispatch($ticket);

            // RETURN RESPONSE
            return [
                'success' => true,
                'message' => 'Ticket sent a reminder to the client successfully',
                'data' => $remindTicket
            ];
        });
    }
}

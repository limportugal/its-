<?php

namespace App\Services\Ticket;

use App\Models\Ticket;
use App\Models\ReopenTicketReason;
use App\Models\UserLogs;
use App\Jobs\SendTicketReopenedEmail;
use App\Traits\HidesUserRolePivot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ReOpenTicketService
{
    use AuthorizesRequests, HidesUserRolePivot;

    public function reOpenTicket(Request $request, $ticket_uuid)
    {
        $request->validate([
            're_open_reason' => 'required|string|max:500',
        ]);
        
        return DB::transaction(function () use ($request, $ticket_uuid) {
            // FIND TICKET USING TICKET UUID WITH OPTIMIZED EAGER LOADING
            $ticket = Ticket::with(['user', 'assignedUser', 'assignedBy'])
                ->where('uuid', $ticket_uuid)
                ->firstOrFail();

            // AUTHORIZE USING POLICY
            $this->authorize('reopen', $ticket);

            // CREATE REOPEN REASON RECORD
            $reopenReason = ReopenTicketReason::create([
                'ticket_id' => $ticket->id,
                'reason_text' => $request->re_open_reason,
                'reopened_by_id' => Auth::id(),
                'reopened_at' => now(),
            ]);

            // UPDATE TICKET STATUS AND CLEAR EXPIRATION DATE
            $ticket->update([
                'status' => 're-open',
                'reopened_by_id' => Auth::id(),
                'expired_at' => null,
                'reopened_at' => now(),
            ]);

            // QUEUE EMAIL NOTIFICATION (ASYNC)
            SendTicketReopenedEmail::dispatch($ticket, Auth::user(), $request->re_open_reason);

            // LOG ACTIVITY
            UserLogs::logActivity("Ticket has been reopened. REOPEN REASON: {$request->re_open_reason}.", Auth::id(), $ticket->ticket_number);

            // RETURN SUCCESS RESPONSE
            return response()->json([
                'success' => true,
                'message' => 'Ticket has been reopened successfully!',
                'data' => $ticket->formatForResponse()
            ]);
        });
    }
}

<?php

namespace App\Services\Ticket;

use App\Models\Ticket;
use App\Models\FollowUpReason;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Auth\Access\AuthorizationException;

class FollowUpTicketByClientService
{
    public function followUpTicketByClient(Request $request, $uuid)
    {
        $ticket = Ticket::where('uuid', $uuid)->firstOrFail();

        // CHECK IF TICKET STATUS ALLOWS FOLLOW UP
        if (strtolower(trim($ticket->status)) !== 'assigned') {
            throw new AuthorizationException('Only assigned tickets can be followed up by the client.');
        }

        // VALIDATE FOLLOW UP REASON AND ATTACHMENT
        $request->validate([
            'follow_up_reason' => 'required|string|min:20|max:1024',
        ]);

        return DB::transaction(function () use ($request, $ticket) {
            $ticket->expired_at = now()->addMinute();
            $ticket->status = 'follow-up';
            $ticket->save();

            // CREATE FOLLOW UP REASON RECORD
            FollowUpReason::create([
                'ticket_id' => $ticket->id,
                'reason_text' => $request->follow_up_reason,
                'follow_up_by_id' => null, // GUEST USER, SO NO USER_ID
                'follow_up_at' => now(),
            ]);

            $ticket->follow_up_at = now();
            $ticket->follow_up_by_id = null; // GUEST USER, SO NO USER_ID
            $ticket->save();
            return response()->json([
                'success' => true,
                'message' => 'Ticket has been successfully followed up.',
                'data' => [
                    'ticket' => [
                        'ticket_number' => $ticket->ticket_number,
                        'uuid' => $ticket->uuid,
                        'status' => $ticket->status
                    ]
                ]
            ], 200);
        });
    }
}
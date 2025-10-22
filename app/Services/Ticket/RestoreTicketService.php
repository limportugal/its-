<?php

namespace App\Services\Ticket;

use App\Models\Ticket;
use App\Models\UserLogs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class RestoreTicketService
{
    use AuthorizesRequests;

    public function restoreTicket($ticket_uuid): JsonResponse
    {
        return DB::transaction(function () use ($ticket_uuid) {
            // FIND TICKET USING TICKET UUID (DELETED TICKETS ONLY)
            $ticket = Ticket::select([
                'id', 'uuid', 'ticket_number', 'status', 'email', 'user_id', 'deleted_at', 'deleted_ticket_by_id'
            ])->where('uuid', $ticket_uuid)
              ->where('status', 'deleted')
              ->whereNotNull('deleted_at')
              ->firstOrFail();

            // AUTHORIZE USING POLICY
            $this->authorize('restore', $ticket);

            // RESTORE TICKET BY SETTING STATUS TO 're-open' AND CLEARING DELETED FIELDS
            $ticket->update([
                'status' => 're-open',
                'deleted_at' => null,
                'deleted_ticket_by_id' => null,
                'restored_ticket_by_id' => Auth::id(),
                'restored_at' => now(),
                'expired_at' => null, // Clear any expiration
            ]);

            // LOG THE RESTORE ACTION
            UserLogs::logActivity("Ticket successfully restored.", Auth::id(), $ticket->ticket_number);

            return response()->json([
                'success' => true,
                'message' => 'Ticket has been successfully restored.',
                'data' => [
                    'ticket_number' => $ticket->ticket_number,
                    'status' => $ticket->status,
                    'restored_at' => now()->toISOString(),
                ]
            ], 200);
        });
    }
}

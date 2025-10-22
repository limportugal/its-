<?php

namespace App\Services\Ticket;

use App\Models\Ticket;
use App\Models\ReturnReason;
use App\Models\UserLogs;
use App\Models\Attachment;
use App\Jobs\SendTicketReturnedEmail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Http\JsonResponse;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ReturnTicketService
{
    use AuthorizesRequests;

    public function returnTicket(Request $request, $ticket_uuid): JsonResponse
    {
        $request->validate([
            'return_reason' => 'required|string|max:500',
        ]);
        
        return DB::transaction(function () use ($request, $ticket_uuid) {
            // FIND TICKET USING TICKET UUID (OPTIMIZED)
            $ticket = Ticket::select([
                'id', 'uuid', 'ticket_number', 'status', 'email', 'expired_at', 'user_id'
            ])->where('ticket_number', $ticket_uuid)->firstOrFail();

            // AUTHORIZE USING POLICY
            $this->authorize('return', $ticket);

            // ALLOW RETURNING EVEN IF TICKET IS EXPIRED
            if (strtolower(trim($ticket->status)) === 'returned') {
                return response()->json(['message' => 'This ticket has already been returned.'], 400);
            }

            // IF TICKET IS EXPIRED, LOG THE ACTION
            if ($ticket->expired_at && $ticket->expired_at < now()) {
                // Ticket is expired but being returned
            }

            // UPDATE TICKET STATUS AND CLEAR EXPIRATION DATE
            $ticket->update([
                'status' => 'returned',
                'returned_by_id' => Auth::id(),
                'expired_at' => null,
                'returned_at' => now(),
            ]);

            // CREATE RETURN REASON RECORD
            ReturnReason::create([
                'ticket_id' => $ticket->id,
                'reason_text' => $request->return_reason,
                'returned_by_id' => Auth::id(),
                'returned_at' => now(),
            ]);

            // SAVE ATTACHMENT IF PROVIDED
            $this->saveAttachment($request, $ticket);

            // LOG ACTIVITY
            $logMessage = "Ticket has been returned. RETURNED REASON: {$request->return_reason}.";
            UserLogs::logActivity($logMessage, Auth::id(), $ticket->ticket_number);

            // SEND EMAIL NOTIFICATION ASYNC (outside transaction to avoid rollback on email failure)
            if (!empty($ticket->email)) {
                SendTicketReturnedEmail::dispatch($ticket, Auth::user())->afterCommit();
            }

            return response()->json([
                'success' => true,
                'message' => 'Ticket has been returned successfully!',
                'data' => $ticket,
            ]);
        });
    }

    // SAVE ATTACHMENT
    private function saveAttachment(Request $request, Ticket $ticket): bool
    {
        if (!$request->hasFile('attachment') || !$request->file('attachment')->isValid()) {
            return false;
        }

        $file = $request->file('attachment');
        
        // GENERATE FILE PATH
        $datePath = Carbon::now()->format('Y/m/d');
        $extension = $file->getClientOriginalExtension();
        $randomName = Str::random(20) . '.' . $extension;
        $filePath = "attachments/{$datePath}/{$randomName}";

        // STORE THE FILE IN S3
        $file->storeAs("attachments/{$datePath}", $randomName, 's3');

        // CREATE ATTACHMENT RECORD IN DATABASE
        Attachment::create([
            'user_id' => Auth::id(), // LOGGED IN USER WHO RETURNED THE TICKET
            'category' => 'RETURNED TICKET ATTACHMENT',
            'original_name' => $file->getClientOriginalName(),
            'file_path' => $filePath,
            'mime_type' => $file->getMimeType(),
            'attachable_type' => Ticket::class,
            'attachable_id' => $ticket->id,
        ]);
        return true;
    }
}

<?php

namespace App\Services\Ticket;

use App\Models\Ticket;
use App\Models\User;
use App\Models\UserLogs;
use App\Models\CloseReason;
use App\Models\Attachment;
use App\Jobs\SendTicketClosedEmail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class UpdateTicketService
{
    use AuthorizesRequests;

    public function updateTicket(Request $request, string $uuid): array
    {
        return DB::transaction(function () use ($request, $uuid) {
            // FETCH TICKET WITH OPTIMIZED QUERY
            $ticket = Ticket::select([
                'id', 'uuid', 'ticket_number', 'status', 'email', 'action_taken',
                'user_id', 'closed_ticket_by_id', 'created_at', 'updated_at'
            ])->where('uuid', $uuid)->firstOrFail();
            
            $userId = request()->user()->id;

            // CHECK IF REQUEST IS TO CLOSE TICKET
            if (in_array($ticket->status, ['resubmitted', 'assigned', 're-open', 'follow-up', 'reminder', 'returned'])) {
                // AUTHORIZE CLOSING TICKET USING SPECIFIC POLICY
                $this->authorize('close', $ticket);
                
                $closedAt = now();
                
                $ticket->update([
                    'status' => 'closed',
                    'user_id' => $userId,
                    'closed_ticket_by_id' => $userId,
                    'closed_at' => $closedAt,
                    'expired_at' => null,
                    'action_taken' => $request->action_taken,
                ]);

                // SAVE CLOSE REASON TO TICKET_CLOSE_REASONS TABLE
                CloseReason::create([
                    'ticket_id' => $ticket->id,
                    'reason_text' => $request->action_taken,
                    'closed_by_id' => $userId,
                    'closed_at' => $closedAt,
                ]);

                // SAVE ATTACHMENT IF PROVIDED
                $this->saveAttachment($request, $ticket);
            } else {
                // CHECK IF TRYING TO CLOSE TICKET WITH INVALID STATUS
                if ($request->has('action_taken') && !empty($request->action_taken)) {
                    // AUTHORIZE CLOSING TICKET USING SPECIFIC POLICY (this will throw exception for invalid status)
                    $this->authorize('close', $ticket);
                } else {
                    // AUTHORIZE REGULAR UPDATE USING POLICY
                    $this->authorize('update', $ticket);
                    
                    $ticket->update(array_merge(
                        $request->only($ticket->getFillable()),
                        ['user_id' => $userId],
                    ));
                }
            }

            // LOG ACTIVITY
            UserLogs::logActivity("Ticket has been closed successfully. ACTION TAKEN: {$ticket->action_taken}.", Auth::id(), $ticket->ticket_number);

            // FETCH THE USER WHO CLOSED THE TICKET (OPTIMIZED)
            $closedByUser = User::select(['id', 'name'])->find($ticket->closed_ticket_by_id);

            // SEND EMAIL NOTIFICATION ASYNC (outside transaction to avoid rollback on email failure)
            if (!empty($ticket->email)) {
                SendTicketClosedEmail::dispatch($ticket);
            }

            // RETURN RESPONSE
            return [
                'success' => true,
                'message' => "Ticket #{$ticket->ticket_number} has been closed successfully!",
                'data' => [
                    'ticket' => $ticket,
                    'closed_ticket_by_id' => $closedByUser ? [
                        'user_id' => $closedByUser->id,
                        'user_name' => $closedByUser->name,
                    ] : null
                ]
            ];
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
            'user_id' => request()->user()->id, // LOGGED IN USER WHO CLOSED THE TICKET
            'category' => 'CLOSED TICKET ATTACHMENT',
            'original_name' => $file->getClientOriginalName(),
            'file_path' => $filePath,
            'mime_type' => $file->getMimeType(),
            'attachable_type' => Ticket::class,
            'attachable_id' => $ticket->id,
        ]);
        return true;
    }
}

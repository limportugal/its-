<?php

namespace App\Services\Ticket;

use App\Models\Ticket;
use App\Models\ResubmissionReason;
use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Jobs\SendTicketResubmittedEmail;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ResubmitTicketService
{
    public function resubmitTicket(Request $request, $uuid)
    {
        $ticket = Ticket::where('uuid', $uuid)->firstOrFail();

        // CHECK IF TICKET IS EXPIRED
        if ($ticket->expired_at && $ticket->expired_at < now()) {
            return response()->json([
                'success' => false,
                'message' => 'The ticket has expired and has already been resubmitted. You are not allowed to resubmit it again.',
                'data' => null
            ], 400);
        }

        // VALIDATE RESUBMISSION REASON AND ATTACHMENT
        $request->validate([
            'resubmission_reason' => 'required|string|min:20|max:1024',
            'attachment' => 'nullable|file|max:10240', // 10MB
        ]);

        // ENSURE TICKET IS CLOSED BEFORE RESUBMITTING
        if (!in_array($ticket->status, ['closed', 'returned', 'cancelled', 'reminder'])) {
            return response()->json([
                'success' => false,
                'message' => 'Only closed, returned, cancelled, and reminder tickets can be resubmitted.',
                'data' => null
            ], 400);
        }

        return DB::transaction(function () use ($request, $ticket) {
            $ticket->expired_at = now()->addMinute();
            $ticket->status = 'resubmitted';
            $ticket->save();

            // CREATE RESUBMISSION REASON RECORD
            $resubmissionReason = ResubmissionReason::create([
                'ticket_id' => $ticket->id,
                'reason_text' => $request->resubmission_reason,
                'resubmitted_by_id' => null, // GUEST USER, SO NO USER_ID
                'resubmitted_at' => now(),
            ]);

            $ticket->submitted_at = now();
            $ticket->updated_at = now();
            $ticket->save();

            // HANDLE ATTACHMENT UPLOAD
            if ($request->hasFile('attachment')) {
                $this->saveAttachment($request, $resubmissionReason);
            }

            // SEND NOTIFICATION IF TICKET HAS EMAIL (outside transaction to avoid rollback on email failure)
            if ($ticket->email) {
                SendTicketResubmittedEmail::dispatch($ticket);
            }

            return response()->json([
                'success' => true,
                'message' => 'Ticket has been successfully resubmitted.',
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

    // SAVE ATTACHMENT
    private function saveAttachment(Request $request, ResubmissionReason $resubmissionReason): void
    {
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');

            if ($file->isValid()) {
                // UPLOAD FILE TO S3
                $datePath = Carbon::now()->format('Y/m/d');
                $extension = $file->getClientOriginalExtension();
                $randomName = Str::random(20) . '.' . $extension;
                $filePath = "attachments/{$datePath}/{$randomName}";

                // STORE THE FILE IN S3
                $file->storeAs("attachments/{$datePath}", $randomName, 's3');

                // CREATE ATTACHMENT RECORD IN DATABASE
                Attachment::create([
                    'user_id' => null, // GUEST USER, SO NO USER_ID
                    'category' => 'RESUBMISSION ATTACHMENT',
                    'original_name' => $file->getClientOriginalName(),
                    'file_path' => $filePath,
                    'mime_type' => $file->getMimeType(),
                    'attachable_type' => ResubmissionReason::class,
                    'attachable_id' => $resubmissionReason->id,
                ]);
            }
        }
    }
}
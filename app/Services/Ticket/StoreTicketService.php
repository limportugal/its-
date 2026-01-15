<?php

namespace App\Services\Ticket;

use App\Models\Ticket;
use App\Models\Attachment;
use App\Jobs\SendTicketCreatedEmail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StoreTicketService
{

    public function createTicket(array $ticketData, ?Request $request = null): array
    {
        // Remove reCAPTCHA token from ticket data after validation (handled by RecaptchaRule)
        unset($ticketData['recaptcha_token']);

        $ticket = null;
        $result = DB::transaction(function () use ($ticketData, $request, &$ticket) {
            // GENERATE TICKET NUMBER
            $ticketData['ticket_number'] = $this->generateTicketNumber();

            // REMOVE ATTACHMENT FIELD FROM TICKET DATA SINCE WE'LL HANDLE IT SEPARATELY
            unset($ticketData['attachment']);

            // CREATE THE TICKET
            $ticket = Ticket::create($ticketData);

            // HANDLE ATTACHMENT IF PRESENT
            $hasAttachment = false;
            if ($request && $request->hasFile('attachment')) {
                $hasAttachment = $this->saveAttachment($request, $ticket);
            }

            // ATTACH CATEGORIES IF PROVIDED
            if (isset($ticketData['categories']) && is_array($ticketData['categories'])) {
                $ticket->categories()->attach($ticketData['categories']);
            }


            // SET MESSAGE BASED ON ATTACHMENT STATUS
            $message = $hasAttachment ? 'Ticket created successfully with attachment!' : 'Ticket created successfully!';

            return [
                'success' => true,
                'message' => $message,
                'data' => [
                    'ticket_number' => $ticket->ticket_number
                ]
            ];
        });

        // SEND EMAIL NOTIFICATION AFTER TRANSACTION IS COMMITTED
        if ($result['success'] && $ticket) {
            $this->sendTicketCreatedNotification($ticket);
        }

        return $result;
    }

    // GENERATE TICKET NUMBER
    public function generateTicketNumber(): string
    {
        $year = now()->year;
        $date = now()->format('mdY'); // MMDDYYYY format

        // Use database lock to prevent race conditions
        $ticketNumber = DB::transaction(function () use ($date, $year) {
            // GET THE HIGHEST TICKET NUMBER FOR TODAY'S DATE
            $lastTicketNumber = Ticket::whereYear('created_at', $year)
                ->where('ticket_number', 'like', "ITS-{$date}-%")
                ->lockForUpdate() // Prevent race conditions
                ->orderBy('ticket_number', 'desc')
                ->value('ticket_number');

            // IF NO TICKET FOUND FOR TODAY, GET THE MOST RECENT TICKET TO CONTINUE SEQUENCE
            if (!$lastTicketNumber) {
                $lastTicketNumber = Ticket::whereYear('created_at', $year)
                    ->where('ticket_number', 'like', 'ITS-%')
                    ->lockForUpdate()
                    ->orderBy('ticket_number', 'desc')
                    ->value('ticket_number');
                
                // IF WE FOUND A TICKET FROM A DIFFERENT DATE, CONTINUE THAT SEQUENCE
                if ($lastTicketNumber) {
                    // EXTRACT DATE FROM THE LAST TICKET (format: ITS-MMDDYYYY-XXXXXX)
                    $date = substr($lastTicketNumber, 4, 8); // Extract MMDDYYYY from ITS-MMDDYYYY-XXXXXX
                }
            }

            // EXTRACT THE INCREMENT NUMBER FROM THE LAST TICKET
            $increment = 1;
            if ($lastTicketNumber) {
                // EXTRACT THE INCREMENT PART (positions 13-17 in format: ITS-MMDDYYYY-00000)
                $lastIncrement = (int) substr($lastTicketNumber, 13, 5);
                $increment = $lastIncrement + 1;
            }

            // FORMAT THE TICKET NUMBER AS "ITS-MMDDYYYY-00000"
            return sprintf('ITS-%s-%05d', $date, $increment);
        });

        return $ticketNumber;
    }

    // SAVE ATTACHMENT
    private function saveAttachment(Request $request, Ticket $ticket): bool
    {
        if (!$request->hasFile('attachment')) {
            return false;
        }

        $file = $request->file('attachment');

        if (!$file || !$file->isValid()) {
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
            'user_id' => null, // GUEST USER, SO NO USER_ID
            'category' => 'CREATED TICKET ATTACHMENT',
            'original_name' => $file->getClientOriginalName(),
            'file_path' => $filePath,
            'mime_type' => $file->getMimeType(),
            'attachable_type' => Ticket::class,
            'attachable_id' => $ticket->id,
        ]);
        
        return true;
    }

    // SEND TICKET CREATED NOTIFICATION
    private function sendTicketCreatedNotification(Ticket $ticket): void
    {
        if (!empty($ticket->email)) {
            SendTicketCreatedEmail::dispatch($ticket);
        }
    }
}

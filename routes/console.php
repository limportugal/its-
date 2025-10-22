<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Jobs\SendTicketCancelledEmail;
use App\Models\Ticket;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

// Register custom commands
Artisan::command('email:resend-cancelled-ticket {ticket_uuid?}', function ($ticketUuid = null) {
    $ticketUuid = $this->argument('ticket_uuid');
    
    if ($ticketUuid) {
        // Resend email for specific ticket
        try {
            $ticket = Ticket::with([
                'priority:id,priority_name',
                'categories:id,category_name',
                'attachments:id,uuid,file_path,original_name,attachable_type,attachable_id',
                'cancelledBy:id,name',
                'cancellationReasons:id,ticket_id,reason_text,cancelled_by_id,cancelled_at'
            ])->where('uuid', $ticketUuid)
              ->where('status', 'cancelled')
              ->first();

            if (!$ticket) {
                $this->error("Cancelled ticket with UUID '{$ticketUuid}' not found.");
                return;
            }

            $this->info("Found cancelled ticket: {$ticket->ticket_number}");
            $this->info("Customer: {$ticket->full_name} ({$ticket->email})");
            $this->info("Cancelled by: " . ($ticket->cancelledBy->name ?? 'N/A'));
            $this->info("Cancellation reason: " . ($ticket->getLatestCancellationReason()?->reason_text ?? 'N/A'));

            if ($this->confirm('Do you want to resend the email for this ticket?')) {
                // Dispatch the email job
                SendTicketCancelledEmail::dispatch($ticket);
                
                $this->info("✅ Cancelled ticket email has been queued for resending!");
                $this->info("Email will be sent to: {$ticket->email}");
                
            } else {
                $this->info("Email resend cancelled.");
            }

        } catch (\Exception $e) {
            $this->error("Error resending email: " . $e->getMessage());
        }
    } else {
        // Show list of cancelled tickets
        $this->info("Fetching cancelled tickets...");
        
        $cancelledTickets = Ticket::with(['cancelledBy:id,name'])
            ->where('status', 'cancelled')
            ->orderBy('cancelled_at', 'desc')
            ->limit(10)
            ->get();

        if ($cancelledTickets->isEmpty()) {
            $this->warn("No cancelled tickets found.");
            return;
        }

        $this->info("Recent cancelled tickets:");
        $this->line("");

        $headers = ['#', 'Ticket Number', 'Customer', 'Email', 'Cancelled By', 'Cancelled At'];
        $rows = [];

        foreach ($cancelledTickets as $index => $ticket) {
            $rows[] = [
                $index + 1,
                $ticket->ticket_number,
                $ticket->full_name,
                $ticket->email,
                $ticket->cancelledBy->name ?? 'N/A',
                $ticket->cancelled_at ? \Carbon\Carbon::parse($ticket->cancelled_at)->format('M d, Y h:i A') : 'N/A'
            ];
        }

        $this->table($headers, $rows);

        $this->line("");
        $this->info("To resend email for a specific ticket, use:");
        $this->line("php artisan email:resend-cancelled-ticket {ticket_uuid}");
        $this->line("");
        if ($cancelledTickets->isNotEmpty()) {
            $this->info("Example:");
            $this->line("php artisan email:resend-cancelled-ticket " . $cancelledTickets->first()->uuid);
        }
    }
})->purpose('Resend cancelled ticket email notification');

<?php

namespace App\Jobs;

use App\Mail\TicketCancelledNotification;
use App\Models\Ticket;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendTicketCancelledEmail implements ShouldQueue
{
    use Queueable, InteractsWithQueue, SerializesModels;

    public ?int $ticketId = null;
    public ?Ticket $ticket = null;

    public function __construct(Ticket $ticket)
    {
        $this->ticketId = $ticket->id;
    }

    public function handle(): void
    {
        // RELOAD THE TICKET WITH ALL NECESSARY RELATIONSHIPS TO ENSURE WE HAVE THE LATEST DATA
        $ticketId = $this->ticketId ?? ($this->ticket ? $this->ticket->id : null);
        
        $ticket = Ticket::with([
            'priority:id,priority_name',
            'categories:id,category_name',
            'attachments:id,uuid,file_path,original_name,attachable_type,attachable_id',
            'cancelledBy:id,name',
            'cancellationReasons:id,ticket_id,reason_text,cancelled_by_id,cancelled_at',
            'serviceCenter:id,service_center_name',
            'system:id,system_name'
        ])->findOrFail($ticketId);
        
        Mail::to($ticket->email)
            ->send(new TicketCancelledNotification($ticket));
    }
}

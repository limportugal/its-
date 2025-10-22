<?php

namespace App\Jobs;

use App\Mail\ClosedTicketNotification;
use App\Models\Ticket;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendTicketClosedEmail implements ShouldQueue
{
    use Queueable, InteractsWithQueue, SerializesModels;

    public ?int $ticketId = null;
    public ?Ticket $ticket = null; // FOR BACKWARD COMPATIBILITY WITH OLD SERIALIZED JOBS

    public function __construct(Ticket $ticket)
    {
        $this->ticketId = $ticket->id;
    }

    public function handle(): void
    {
        // RELOAD THE TICKET WITH ALL NECESSARY RELATIONSHIPS TO ENSURE WE HAVE THE LATEST DATA
        $ticket = Ticket::with([
            'closedBy:id,name',
            'priority:id,priority_name',
            'categories:id,category_name',
            'attachments:id,uuid,file_path,original_name,attachable_type,attachable_id,user_id,category,mime_type',
            'serviceCenter:id,service_center_name',
            'system:id,system_name'
        ])->findOrFail($this->ticketId ?? ($this->ticket ? $this->ticket->id : null));
        
        Mail::to($ticket->email)
            ->send(new ClosedTicketNotification($ticket));
    }
}

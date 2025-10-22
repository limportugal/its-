<?php

namespace App\Jobs;

use App\Mail\ReOpenTicketMail;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendTicketReopenedEmail implements ShouldQueue
{
    use Queueable, InteractsWithQueue, SerializesModels;

    public ?int $ticketId = null;
    public ?int $reopenedById = null;
    public ?Ticket $ticket = null; // For backward compatibility with old serialized jobs
    public ?User $reopenedBy = null; // For backward compatibility with old serialized jobs
    public ?string $reopenReason;

    public function __construct(Ticket $ticket, User $reopenedBy, ?string $reopenReason = null)
    {
        $this->ticketId = $ticket->id;
        $this->reopenedById = $reopenedBy->id;
        $this->reopenReason = $reopenReason;
    }

    public function handle(): void
    {
        // RELOAD THE TICKET WITH ALL NECESSARY RELATIONSHIPS TO ENSURE WE HAVE THE LATEST DATA
        $ticket = Ticket::with([
            'priority:id,priority_name',
            'categories:id,category_name',
            'attachments:id,uuid,file_path,original_name,attachable_type,attachable_id',
            'serviceCenter:id,service_center_name',
            'system:id,system_name'
        ])->findOrFail($this->ticketId ?? ($this->ticket ? $this->ticket->id : null));
        
        $reopenedBy = User::findOrFail($this->reopenedById ?? ($this->reopenedBy ? $this->reopenedBy->id : null));
        
        Mail::to($ticket->email)
            ->send(new ReOpenTicketMail($ticket, $reopenedBy, $this->reopenReason));
    }
}

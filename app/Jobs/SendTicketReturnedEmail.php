<?php

namespace App\Jobs;

use App\Mail\ReturnTicketMail;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendTicketReturnedEmail implements ShouldQueue
{
    use Queueable, InteractsWithQueue, SerializesModels;

    public ?int $ticketId = null;
    public ?int $userId = null;
    public ?Ticket $ticket = null; // FOR BACKWARD COMPATIBILITY WITH OLD SERIALIZED JOBS
    public ?User $user = null; // FOR BACKWARD COMPATIBILITY WITH OLD SERIALIZED JOBS

    public function __construct(Ticket $ticket, User $user)
    {
        $this->ticketId = $ticket->id;
        $this->userId = $user->id;
    }

    public function handle(): void
    {
        // RELOAD THE TICKET WITH ALL NECESSARY RELATIONSHIPS TO ENSURE WE HAVE THE LATEST DATA
        $ticketId = $this->ticketId ?? ($this->ticket ? $this->ticket->id : null);
        $userId = $this->userId ?? ($this->user ? $this->user->id : null);

        $ticket = Ticket::with([
            'returnedBy:id,name',
            'priority:id,priority_name',
            'categories:id,category_name',
            'attachments:id,uuid,file_path,original_name,attachable_type,attachable_id,user_id,category,mime_type',
            'serviceCenter:id,service_center_name',
            'system:id,system_name'
        ])->findOrFail($ticketId);
        
        $user = User::findOrFail($userId);
        
        Mail::to($ticket->email)
            ->send(new ReturnTicketMail($ticket, $user));
    }
}

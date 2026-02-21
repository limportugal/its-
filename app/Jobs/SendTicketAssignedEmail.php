<?php

namespace App\Jobs;

use App\Mail\TicketAssignedNotification;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendTicketAssignedEmail implements ShouldQueue
{
    use Queueable, InteractsWithQueue, SerializesModels;

    public ?int $ticketId = null;
    public ?int $assignedUserId = null;
    public ?Ticket $ticket = null; // FOR BACKWARD COMPATIBILITY WITH OLD SERIALIZED JOBS

    public function __construct(Ticket $ticket, ?int $assignedUserId = null)
    {
        $this->ticketId = $ticket->id;
        $this->assignedUserId = $assignedUserId;
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

        $recipient = null;
        if (!empty($this->assignedUserId)) {
            $recipient = User::select('id', 'name', 'email')->find($this->assignedUserId);
        }

        // Backward compatibility: if old jobs have no assigned user id, fallback to ticket primary assignee.
        if (!$recipient) {
            $recipient = $ticket->assignedUser()->select('id', 'name', 'email')->first();
        }

        if (!$recipient || empty($recipient->email)) {
            return;
        }

        // Keep existing mailable behavior by setting the recipient as assignedUser relation.
        $ticket->setRelation('assignedUser', $recipient);

        Mail::to($recipient->email)
            ->send(new TicketAssignedNotification($ticket));
    }
}

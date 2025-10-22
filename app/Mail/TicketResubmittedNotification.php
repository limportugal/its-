<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Ticket;
use Illuminate\Mail\Mailables\Envelope;

class TicketResubmittedNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $ticket;
    public $support_portal_link;
    public function __construct(Ticket $ticket)
    {
        // Use the ticket as-is since relationships are already loaded by the job
        $this->ticket = $ticket;
        $this->support_portal_link = config('app.url');
    }

    public function build()
    {
        return $this->subject('Your Ticket Has Been Resubmitted')
            ->view('emails.ticket_resubmitted')
            ->with([
                'created_at' => $this->ticket->created_at,
                'full_name' => $this->ticket->full_name,
                'company' => $this->ticket->company ?? 'N/A',
                'email' => $this->ticket->email,
                'ticket_number' => $this->ticket->ticket_number,
                'priority' => $this->ticket->priority->priority_name ?? 'N/A',
                'category_name' => $this->ticket->categories->pluck('category_name')->implode(', '),
                'service_center_name' => $this->ticket->serviceCenter->service_center_name ?? 'N/A',
                'system_name' => $this->ticket->system->system_name ?? 'N/A',
                'description' => $this->ticket->description,
                'attachments' => $this->ticket->attachments,
                'resubmission_reason' => $this->ticket->resubmission_reason,
                'status' => $this->ticket->status,
                'resubmittedAt' => $this->ticket->updated_at,
                'support_portal_link' => $this->support_portal_link,
                'ticketLink' => config('app.url'),
            ]);
    }

    // SET THE SUBJECT OF THE EMAIL
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Ticket Resubmitted - ' . $this->ticket->ticket_number,
        );
    }
}

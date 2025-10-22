<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Ticket;

class TicketCreatedNotification extends Mailable
{
    use Queueable, SerializesModels;

    public Ticket $ticket;
    public string $support_portal_link;


    public function __construct(Ticket $ticket)
    {
        // Use the ticket as-is since relationships are already loaded by the job
        $this->ticket = $ticket;
        $this->support_portal_link = config('app.url');
    }

    public function build()
    {
        return $this->view('emails.created_ticket')
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
                'attachments' => $this->ticket->attachments,
                'description' => $this->ticket->description,
                'status' => $this->ticket->status,
                'support_portal_link' => $this->support_portal_link,
            ]);
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Ticket Confirmation - ' . $this->ticket->ticket_number,
            from: config('mail.from.address'),
            replyTo: config('mail.to_support'),
        );
    }
}

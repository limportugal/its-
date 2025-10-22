<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Ticket;

class TicketAssignedNotification extends Mailable
{
    use Queueable, SerializesModels;

    public Ticket $ticket;
    public string $support_portal_link;
    public string $view_tickets_link;

    public function __construct(Ticket $ticket)
    {
        // Use the ticket as-is since relationships are already loaded by the job
        $this->ticket = $ticket;
        // Default support portal link (home page)
        $this->support_portal_link = config('app.url');
        // Button link for viewing the specific assigned ticket
        $this->view_tickets_link = route('tickets.viewPendingTicketByUuid', ['uuid' => $ticket->uuid]);
    }

    public function build()
    {
        return $this->subject('Ticket Assigned Notification - ' . $this->ticket->ticket_number)
            ->view('emails.ticket_assigned')
            ->with([
                // TICKET CREATOR INFO (for context)
                'reported_by_name' => $this->ticket->full_name,
                'reported_by_email' => $this->ticket->email,
                'company' => $this->ticket->company ?? 'N/A',
                
                // TICKET DETAILS
                'ticket_number' => $this->ticket->ticket_number,
                'priority' => $this->ticket->priority->priority_name ?? 'N/A',
                'category_name' => $this->ticket->categories->pluck('category_name')->implode(', '),
                'service_center_name' => $this->ticket->serviceCenter->service_center_name ?? 'N/A',
                'system_name' => $this->ticket->system->system_name ?? 'N/A',
                'description' => $this->ticket->description,
                'attachments' => $this->ticket->attachments,
                'created_at' => $this->ticket->created_at,
                'status' => $this->ticket->status,
                
                // ASSIGNED USER INFO (the recipient)
                'assigned_to' => $this->ticket->assignedUser->name ?? 'N/A',
                'assigned_user_email' => $this->ticket->assignedUser->email ?? 'N/A',
                
                'support_portal_link' => $this->support_portal_link,
                'view_tickets_link' => $this->view_tickets_link,
            ]);
    }
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Ticket Assigned Notification - ' . $this->ticket->ticket_number,
        );
    }
}

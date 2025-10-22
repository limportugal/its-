<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use App\Models\Ticket;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class ReOpenTicketMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $ticket;
    public $ticketLink;
    public $reopenedBy;
    public $reopenReason;

    public function __construct(Ticket $ticket, $reopenedBy, $reopenReason = null)
    {
        // Use the ticket as-is since relationships are already loaded by the job
        $this->ticket = $ticket;
        $this->reopenedBy = $reopenedBy;
        $this->reopenReason = $reopenReason;
        $this->ticketLink = route('tickets.viewPendingTicketByUuid', ['uuid' => $ticket->uuid]);
    }

    public function build()
    {
        return $this->subject('Your Ticket Has Been Reopened')
            ->view('emails.reopen_ticket')
            ->with([
                // TICKET DETAILS
                'created_at' => $this->ticket->created_at,
                'full_name' => $this->ticket->full_name,
                'email' => $this->ticket->email,
                'company' => $this->ticket->company ?? 'N/A',
                'ticket_number' => $this->ticket->ticket_number,
                'priority' => $this->ticket->priority->priority_name ?? 'N/A',
                'category_name' => $this->ticket->categories->pluck('category_name')->implode(', ') ?? 'N/A',
                'service_center_name' => $this->ticket->serviceCenter->service_center_name ?? 'N/A',
                'system_name' => $this->ticket->system->system_name ?? 'N/A',
                'description' => $this->ticket->description,
                'attachments' => $this->ticket->attachments,
                'status' => $this->ticket->status,

                // REOPEN DETAILS
                'name' => $this->reopenedBy->name ?? 'N/A',
                'reopened_by' => $this->reopenedBy->name ?? 'N/A',
                'ticketNumber' => $this->ticket->ticket_number,
                'reopenReason' => $this->reopenReason ?? $this->ticket->getLatestReopenReason()?->reason_text ?? 'No reason provided',
                'reopenedAt' => $this->ticket->reopened_at ?? $this->ticket->updated_at,
                'reopened_user_avatar_url' => $this->reopenedBy->avatar_url ?? null,
                'reopened_user_avatar_base64' => $this->getAvatarAsBase64(),
                'reopened_user_avatar_public' => $this->getPublicAvatarUrl(),
                'reopened_user_first_letter' => $this->reopenedBy ? strtoupper(substr($this->reopenedBy->name, 0, 1)) : 'A',
                'ticketLink' => $this->ticketLink,
                'support_portal_link' => config('app.url'),
            ]);
    }

    private function getAvatarAsBase64()
    {
        if (!$this->reopenedBy || !$this->reopenedBy->avatar_url) {
            return null;
        }

        // If avatar_url is already a data URL (base64), return it directly
        if (str_starts_with($this->reopenedBy->avatar_url, 'data:')) {
            return $this->reopenedBy->avatar_url;
        }

        // Get the profile picture attachment directly from S3
        try {
            $profilePicture = $this->reopenedBy->profilePicture()->first();
            
            if (!$profilePicture || !$profilePicture->file_path) {
                return null;
            }
            
            // Get file content directly from S3 storage
            $imageData = \Storage::disk('s3')->get($profilePicture->file_path);
            
            if ($imageData === false) {
                return null;
            }
            
            // Use the stored mime type or detect it
            $mimeType = $profilePicture->mime_type;
            
            if (!$mimeType || !str_starts_with($mimeType, 'image/')) {
                $finfo = finfo_open(FILEINFO_MIME_TYPE);
                $mimeType = finfo_buffer($finfo, $imageData);
                finfo_close($finfo);
                
                // Fallback to default if mime type detection fails
                if (!$mimeType || !str_starts_with($mimeType, 'image/')) {
                    $mimeType = 'image/jpeg';
                }
            }
            
            return 'data:' . $mimeType . ';base64,' . base64_encode($imageData);
        } catch (\Exception $e) {
            return null;
        }
    }

    private function getPublicAvatarUrl()
    {
        if (!$this->reopenedBy || !$this->reopenedBy->avatar_url) {
            return null;
        }

        // If avatar_url is already a data URL (base64), return null for public URL
        if (str_starts_with($this->reopenedBy->avatar_url, 'data:')) {
            return null;
        }

        // Ensure we have a complete absolute URL
        $avatarUrl = $this->reopenedBy->avatar_url;
        
        // If it's already a complete URL, return it
        if (str_starts_with($avatarUrl, 'http://') || str_starts_with($avatarUrl, 'https://')) {
            return $avatarUrl;
        }
        
        // If it's a relative URL, make it absolute
        return config('app.url') . $avatarUrl;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Reopened Ticket Notification - ' . $this->ticket->ticket_number,
        );
    }
}

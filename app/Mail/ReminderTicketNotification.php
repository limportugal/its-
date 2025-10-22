<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Ticket;
use Exception;

class ReminderTicketNotification extends Mailable
{
    use Queueable, SerializesModels;

    public Ticket $ticket;
    public $ticketLink;

    public function __construct(Ticket $ticket)
    {
        // Use the ticket as-is since relationships are already loaded by the job
        $this->ticket = $ticket;
        $this->ticketLink = url("/ticket/resubmit/" . $ticket->uuid);
    }

    public function build()
    {
        return $this->subject('[Ticket Reminder] Ticket #' . $this->ticket->ticket_number)
            ->view('emails.reminder_ticket')
            ->with([
                // TICKET DETAILS
                'created_at' => $this->ticket->created_at,
                'full_name' => $this->ticket->full_name,
                'company' => $this->ticket->company ?? 'N/A',
                'email' => $this->ticket->email,
                'ticket_number' => $this->ticket->ticket_number,
                'priority' => $this->ticket->priority->priority_name,
                'category_name' => $this->ticket->categories->isNotEmpty()
                ? $this->ticket->categories->pluck('category_name')->implode(', ')
                : 'N/A',
                'service_center_name' => $this->ticket->serviceCenter->service_center_name ?? 'N/A',
                'system_name' => $this->ticket->system->system_name ?? 'N/A',
                'description' => $this->ticket->description,
                'attachments' => $this->ticket->attachments,
                'status' => $this->ticket->status,

                // REMINDER TICKET DETAILS
                'name' => optional($this->ticket->remindedBy)->name ?? 'N/A',
                'reminded_by' => optional($this->ticket->remindedBy)->name ?? 'N/A',
                'reminder_reason' => $this->ticket->reminderReasons->last()->reason_text ?? 'N/A',
                'updated_at' => $this->ticket->updated_at,
                'reminded_at' => $this->ticket->reminded_at ?? $this->ticket->updated_at,
                'reminded_user_avatar_url' => optional($this->ticket->remindedBy)->avatar_url ?? null,
                'reminded_user_avatar_base64' => $this->getAvatarAsBase64(),
                'reminded_user_avatar_public' => $this->getPublicAvatarUrl(),
                'reminded_user_first_letter' => $this->ticket->remindedBy ? strtoupper(substr($this->ticket->remindedBy->name, 0, 1)) : 'A',
                'department_name' => optional($this->ticket->department)->department ?? 'Apsoft Team',
                'ticketLink' => $this->ticketLink,
                'support_portal_link' => config('app.url'),

            ]);
    }

    private function getAvatarAsBase64()
    {
        if (!$this->ticket->remindedBy || !$this->ticket->remindedBy->avatar_url) {
            return null;
        }

        // If avatar_url is already a data URL (base64), return it directly
        if (str_starts_with($this->ticket->remindedBy->avatar_url, 'data:')) {
            return $this->ticket->remindedBy->avatar_url;
        }

        // Get the profile picture attachment directly from S3
        try {
            $profilePicture = $this->ticket->remindedBy->profilePicture()->first();
            
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
        if (!$this->ticket->remindedBy || !$this->ticket->remindedBy->avatar_url) {
            return null;
        }

        // If avatar_url is already a data URL (base64), return null for public URL
        if (str_starts_with($this->ticket->remindedBy->avatar_url, 'data:')) {
            return null;
        }

        // Ensure we have a complete absolute URL
        $avatarUrl = $this->ticket->remindedBy->avatar_url;
        
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
            subject: 'Reminder Ticket Notification - ' . $this->ticket->ticket_number,
        );
    }
}

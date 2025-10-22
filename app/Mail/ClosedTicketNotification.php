<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Ticket;
use Illuminate\Support\Facades\Storage;

class ClosedTicketNotification extends Mailable
{
    use Queueable, SerializesModels;

    public Ticket $ticket;
    public $ticketLink;


    public function __construct(Ticket $ticket)
    {
        $this->ticket = $ticket;
        $this->ticketLink = route('ticket.resubmit.view', ['uuid' => $ticket->uuid]);
    }

    public function build()
    {
        // GET AGENT ATTACHMENTS (attachments added when closing the ticket)
        $agentAttachments = $this->ticket->attachments()
            ->where('category', 'CLOSED TICKET ATTACHMENT')
            ->where('user_id', $this->ticket->closed_ticket_by_id)
            ->get();

        // GET CLIENT ATTACHMENTS (original attachments from ticket creation - user_id is null for guest users)
        $clientAttachments = $this->ticket->attachments()
            ->where('category', 'CREATED TICKET ATTACHMENT')
            ->whereNull('user_id')
            ->get();



        $mail = $this->subject('[Ticket Closed] Ticket #' . $this->ticket->ticket_number)
            ->view('emails.closed_ticket')
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
                'attachments' => $clientAttachments, // CLIENT ATTACHMENTS ONLY
                'agent_attachments' => $agentAttachments, // AGENT ATTACHMENTS SEPARATELY
                'status' => $this->ticket->status,

                // CLOSED TICKET DETAILS
                'name' => optional($this->ticket->closedBy)->name ?? 'N/A',
                'closed_by' => optional($this->ticket->closedBy)->name ?? 'N/A',
                'action_taken' => $this->ticket->action_taken,
                'updated_at' => $this->ticket->updated_at,
                'closed_at' => $this->ticket->closed_at ?? $this->ticket->updated_at,
                'closed_user_avatar_url' => optional($this->ticket->closedBy)->avatar_url ?? null,
                'closed_user_avatar_base64' => $this->getAvatarAsBase64(),
                'closed_user_avatar_public' => $this->getPublicAvatarUrl(),
                'closed_user_first_letter' => $this->ticket->closedBy ? strtoupper(substr($this->ticket->closedBy->name, 0, 1)) : 'A',
                'department_name' => optional($this->ticket->department)->department ?? 'Apsoft Team',
                'ticketLink' => $this->ticketLink,
                'support_portal_link' => config('app.url'),

            ]);

        // ATTACH FILES TO EMAIL
        $this->attachFiles($mail, $agentAttachments, $clientAttachments);

        return $mail;
    }

    private function getAvatarAsBase64()
    {
        if (!$this->ticket->closedBy || !$this->ticket->closedBy->avatar_url) {
            return null;
        }

        // IF AVATAR_URL IS ALREADY A DATA URL (BASE64), RETURN IT DIRECTLY
        if (str_starts_with($this->ticket->closedBy->avatar_url, 'data:')) {
            return $this->ticket->closedBy->avatar_url;
        }

        // Get the profile picture attachment directly from S3
        try {
            $profilePicture = $this->ticket->closedBy->profilePicture()->first();
            
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
        if (!$this->ticket->closedBy || !$this->ticket->closedBy->avatar_url) {
            return null;
        }

        // IF AVATAR_URL IS ALREADY A DATA URL (BASE64), RETURN NULL FOR PUBLIC URL
        if (str_starts_with($this->ticket->closedBy->avatar_url, 'data:')) {
            return null;
        }

        // Ensure we have a complete absolute URL
        $avatarUrl = $this->ticket->closedBy->avatar_url;
        
        // If it's already a complete URL, return it
        if (str_starts_with($avatarUrl, 'http://') || str_starts_with($avatarUrl, 'https://')) {
            return $avatarUrl;
        }
        
        // If it's a relative URL, make it absolute
        return config('app.url') . $avatarUrl;
    }

    private function attachFiles($mail, $agentAttachments = null, $clientAttachments = null)
    {
        // ATTACH AGENT ATTACHMENTS (FILES ADDED WHEN CLOSING THE TICKET)
        if ($agentAttachments && $agentAttachments->isNotEmpty()) {
            foreach ($agentAttachments as $attachment) {
                try {
                    // GET THE FILE CONTENT FROM S3 STORAGE
                    $fileContent = Storage::disk('s3')->get($attachment->file_path);
                    
                    if ($fileContent) {
                        // ATTACH THE FILE CONTENT DIRECTLY TO THE EMAIL
                        $mail->attachData($fileContent, $attachment->original_name, [
                            'mime' => $attachment->mime_type,
                        ]);
                    }
                } catch (\Exception $e) {
                    // Continue processing other attachments silently
                }
            }
        }

        // ATTACH CLIENT ATTACHMENTS (ORIGINAL FILES FROM TICKET CREATION)
        if ($clientAttachments && $clientAttachments->isNotEmpty()) {
            foreach ($clientAttachments as $attachment) {
                try {
                    // GET THE FILE CONTENT FROM S3 STORAGE
                    $fileContent = Storage::disk('s3')->get($attachment->file_path);
                    
                    if ($fileContent) {
                        // ATTACH THE FILE CONTENT DIRECTLY TO THE EMAIL
                        $mail->attachData($fileContent, $attachment->original_name, [
                            'mime' => $attachment->mime_type,
                        ]);
                    }
                } catch (\Exception $e) {
                    // Continue processing other attachments silently
                }
            }
        }
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Closed Ticket Notification - ' . $this->ticket->ticket_number,
        );
    }
}

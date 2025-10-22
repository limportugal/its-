<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use App\Models\Ticket;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class ReturnTicketMail extends Mailable
{
    use Queueable, SerializesModels;

    public $ticket;
    public $ticketLink;
    public $returnUrl;
    public $returnedBy;

    public function __construct(Ticket $ticket, $returnedBy)
    {
        $this->ticket = $ticket;
        $this->returnedBy = $returnedBy;
        $this->ticketLink = url("/ticket/resubmit/" . $ticket->uuid);
        $this->returnUrl = url("/tickets/return/" . $this->ticket->uuid);
    }

    public function build()
    {
        // GET AGENT ATTACHMENTS (attachments added when returning the ticket)
        // Use the returned_by_id from the ticket, not the passed user object
        $agentAttachments = $this->ticket->attachments()
            ->where('category', 'RETURNED TICKET ATTACHMENT')
            ->where('user_id', $this->ticket->returned_by_id)
            ->get();

        // FALLBACK: If no agent attachments found with ticket->returned_by_id, try with returnedBy->id
        if ($agentAttachments->isEmpty() && $this->returnedBy) {
            $agentAttachments = $this->ticket->attachments()
                ->where('category', 'RETURNED TICKET ATTACHMENT')
                ->where('user_id', $this->returnedBy->id)
                ->get();
        }

        // GET CLIENT ATTACHMENTS (original attachments from ticket creation - user_id is null for guest users)
        $clientAttachments = $this->ticket->attachments()
            ->where('category', 'CREATED TICKET ATTACHMENT')
            ->whereNull('user_id')
            ->get();


        $returnUrl = url("/tickets/return/" . $this->ticket->uuid);

        $mail = $this->subject('[Ticket Returned] Ticket #' . $this->ticket->ticket_number)
            ->view('emails.return_ticket')
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

                // RETURN DETAILS
                'name' => $this->returnedBy->name ?? 'N/A',
                'returned_by' => $this->returnedBy->name ?? 'N/A',
                'ticketNumber' => $this->ticket->ticket_number,
                'returnReason' => $this->ticket->getLatestReturnReason()?->reason_text ?? 'No reason provided',
                'returnedAt' => $this->ticket->updated_at,
                'returned_at' => $this->ticket->updated_at,
                'returned_user_avatar_url' => $this->returnedBy->avatar_url ?? null,
                'returned_user_avatar_base64' => $this->getAvatarAsBase64(),
                'returned_user_avatar_public' => $this->getPublicAvatarUrl(),
                'returned_user_first_letter' => $this->returnedBy ? strtoupper(substr($this->returnedBy->name, 0, 1)) : 'A',
                'department_name' => optional($this->ticket->department)->department ?? 'Apsoft Team',
                'returnUrl' => $returnUrl,
                'ticketLink' => $this->ticketLink,
                'support_portal_link' => config('app.url'),
            ]);

        // ATTACH FILES TO EMAIL
        $this->attachFiles($mail, $agentAttachments, $clientAttachments);

        return $mail;
    }

    private function getAvatarAsBase64()
    {
        if (!$this->returnedBy || !$this->returnedBy->avatar_url) {
            return null;
        }

        // If avatar_url is already a data URL (base64), return it directly
        if (str_starts_with($this->returnedBy->avatar_url, 'data:')) {
            return $this->returnedBy->avatar_url;
        }

        // Get the profile picture attachment directly from S3
        try {
            $profilePicture = $this->returnedBy->profilePicture()->first();
            
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
        if (!$this->returnedBy || !$this->returnedBy->avatar_url) {
            return null;
        }

        // If avatar_url is already a data URL (base64), return null for public URL
        if (str_starts_with($this->returnedBy->avatar_url, 'data:')) {
            return null;
        }

        // Ensure we have a complete absolute URL
        $avatarUrl = $this->returnedBy->avatar_url;
        
        // If it's already a complete URL, return it
        if (str_starts_with($avatarUrl, 'http://') || str_starts_with($avatarUrl, 'https://')) {
            return $avatarUrl;
        }
        
        // If it's a relative URL, make it absolute
        return config('app.url') . $avatarUrl;
    }

    private function attachFiles($mail, $agentAttachments = null, $clientAttachments = null)
    {
        // ATTACH AGENT ATTACHMENTS (FILES ADDED WHEN RETURNING THE TICKET)
        if ($agentAttachments && $agentAttachments->isNotEmpty()) {
            foreach ($agentAttachments as $attachment) {
                // GET THE FILE CONTENT FROM S3 STORAGE
                $fileContent = Storage::disk('s3')->get($attachment->file_path);
                
                if ($fileContent) {
                    // ATTACH THE FILE CONTENT DIRECTLY TO THE EMAIL
                    $mail->attachData($fileContent, $attachment->original_name, [
                        'mime' => $attachment->mime_type,
                    ]);
                }
            }
        }

        // ATTACH CLIENT ATTACHMENTS (ORIGINAL FILES FROM TICKET CREATION)
        if ($clientAttachments && $clientAttachments->isNotEmpty()) {
            foreach ($clientAttachments as $attachment) {
                // GET THE FILE CONTENT FROM S3 STORAGE
                $fileContent = Storage::disk('s3')->get($attachment->file_path);
                
                if ($fileContent) {
                    // ATTACH THE FILE CONTENT DIRECTLY TO THE EMAIL
                    $mail->attachData($fileContent, $attachment->original_name, [
                        'mime' => $attachment->mime_type,
                    ]);
                }
            }
        }
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Returned Ticket Notification - ' . $this->ticket->ticket_number,
        );
    }
}

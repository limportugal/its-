<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Ticket;

class TicketAssignedToCreatorNotification extends Mailable
{
    use Queueable, SerializesModels;

    public Ticket $ticket;
    public string $support_portal_link;

    public function __construct(Ticket $ticket)
    {
        // Use the ticket as-is since relationships are already loaded by the job
        $this->ticket = $ticket;
        $this->support_portal_link = config('app.url') . '/login';
    }

    public function build()
    {
        // Get all assigned users with their details
        $assignedUsers = $this->ticket->assignToUsers()->with('user:id,name,email,avatar_url')->get()->map(function ($assignment) {
            return [
                'name' => $assignment->user->name,
                'email' => $assignment->user->email,
                'avatar_url' => $assignment->user->avatar_url,
                'first_letter' => strtoupper(substr($assignment->user->name, 0, 1)),
                'assigned_at' => $assignment->assigned_at,
            ];
        });

        return $this->subject('Your Ticket Has Been Assigned - ' . $this->ticket->ticket_number)
            ->view('emails.ticket_assigned_to_creator')
            ->with([
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
                'created_at' => $this->ticket->created_at,
                'status' => $this->ticket->status,
                'assigned_users' => $assignedUsers,
                'assigned_to' => $this->ticket->assignedUser->name ?? 'N/A',
                'assigned_user_avatar_url' => $this->ticket->assignedUser->avatar_url ?? null,
                'assigned_user_avatar_base64' => $this->getAvatarAsBase64(),
                'assigned_user_avatar_public' => $this->getPublicAvatarUrl(),
                'assigned_user_first_letter' => $this->ticket->assignedUser ? strtoupper(substr($this->ticket->assignedUser->name, 0, 1)) : 'A',
                'assigned_at' => $this->ticket->assignToUsers()->latest('assigned_at')->first()->assigned_at ?? now(),
                'support_portal_link' => $this->support_portal_link,
                'follow_up_link' => route('ticket.followUp.view', $this->ticket->uuid),
                'uuid' => $this->ticket->uuid,
            ]);
    }

    private function getAvatarAsBase64()
    {
        if (!$this->ticket->assignedUser || !$this->ticket->assignedUser->avatar_url) {
            return null;
        }

        // If avatar_url is already a data URL (base64), return it directly
        if (str_starts_with($this->ticket->assignedUser->avatar_url, 'data:')) {
            return $this->ticket->assignedUser->avatar_url;
        }

        // Get the profile picture attachment directly from S3
        try {
            $profilePicture = $this->ticket->assignedUser->profilePicture()->first();
            
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
        if (!$this->ticket->assignedUser || !$this->ticket->assignedUser->avatar_url) {
            return null;
        }

        // If avatar_url is already a data URL (base64), return null for public URL
        if (str_starts_with($this->ticket->assignedUser->avatar_url, 'data:')) {
            return null;
        }

        // Ensure we have a complete absolute URL
        $avatarUrl = $this->ticket->assignedUser->avatar_url;
        
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
            subject: 'Your Ticket Has Been Assigned - ' . $this->ticket->ticket_number,
        );
    }
}

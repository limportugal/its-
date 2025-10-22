<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class UserDeactivatedNotification extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;
    public ?string $reason;
    public string $deactivated_at;
    public ?User $deactivator;
    public $support_portal_link;

    public function __construct(User $user, ?string $reason = null, ?User $deactivator = null)
    {
        $this->user = $user;
        $this->reason = $reason;
        $this->deactivator = $deactivator;
        $this->deactivated_at = now()->toDateTimeString();
        $this->support_portal_link = config('app.url');
    }

    public function build()
    {
        return $this->view('emails.user_deactivated')
            ->with([
                'full_name' => $this->user->name,
                'email' => $this->user->email,
                'deactivated_at' => $this->deactivated_at,
                'reason' => $this->reason,
                'deactivator_name' => optional($this->deactivator)->name ?? 'N/A',
                'support_portal_link' => $this->support_portal_link,
            ]);
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Account Deactivation Notice',
        );
    }
}

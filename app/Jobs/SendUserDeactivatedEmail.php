<?php

namespace App\Jobs;

use App\Mail\UserDeactivatedNotification;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendUserDeactivatedEmail implements ShouldQueue
{
    use Queueable, InteractsWithQueue, SerializesModels;

    public User $user;
    public ?string $reason;
    public ?User $deactivator;

    public function __construct(User $user, ?string $reason = null, ?User $deactivator = null)
    {
        $this->user = $user;
        $this->reason = $reason;
        $this->deactivator = $deactivator;
    }

    public function handle(): void
    {
        Mail::to($this->user->email)
            ->send(new UserDeactivatedNotification($this->user, $this->reason, $this->deactivator));
    }
}

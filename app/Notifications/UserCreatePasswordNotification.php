<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\URL;
use Carbon\Carbon;

class UserCreatePasswordNotification extends Notification
{
    public function __construct() {}

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $url = URL::temporarySignedRoute(
            'password.create', // Route name na gagamitin sa pag-create ng password
            now()->addWeek(), // Expiration time (1 week)
            ['user' => $notifiable->uuid] // Parameters (User UUID)
        );

        return (new MailMessage)
            ->subject('Set Your Password')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Your account has been created. Please set your password by clicking the button below.')
            ->action('Set Password', $url)
            ->line('This link will expire in 1 week.');
    }
}

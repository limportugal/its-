<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TicketReminderReason extends Model
{
    protected $fillable = [
        'ticket_id',
        'reason_text',
        'reminded_by_id',
        'reminded_at',
    ];

    protected $casts = [
        'reminded_at' => 'datetime',
    ];

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }

    public function remindedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reminded_by_id');
    }
}

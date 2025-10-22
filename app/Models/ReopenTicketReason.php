<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReopenTicketReason extends Model
{
    protected $table = 'ticket_reopen_reasons';
    protected $fillable = [
        'ticket_id',
        'reason_text',
        'reopened_by_id',
        'reopened_at',
    ];

    protected $casts = [
        'reopened_at' => 'datetime',
    ];

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }

    public function reopenedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reopened_by_id');
    }
}

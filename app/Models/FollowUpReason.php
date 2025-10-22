<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FollowUpReason extends Model
{
    protected $table = 'ticket_follow_up_reasons';
    
    protected $fillable = [
        'ticket_id',
        'reason_text',
        'follow_up_by_id',
        'follow_up_at',
    ];

    protected $casts = [
        'follow_up_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the ticket that this follow-up reason belongs to.
     */
    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class, 'ticket_id');
    }

    /**
     * Get the user who created this follow-up reason.
     */
    public function followUpBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'follow_up_by_id');
    }
}

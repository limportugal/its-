<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CancellationReason extends Model
{
    use HasFactory;

    protected $table = 'ticket_cancellation_reasons';
    protected $fillable = [
        'ticket_id',
        'reason_text',
        'cancelled_by_id',
        'cancelled_at'
    ];

    protected $casts = [
        'cancelled_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // RELATIONSHIP TO TICKET
    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    // RELATIONSHIP TO USER WHO CANCELLED
    public function cancelledBy()
    {
        return $this->belongsTo(User::class, 'cancelled_by_id');
    }
}

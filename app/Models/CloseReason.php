<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CloseReason extends Model
{
    use HasFactory;

    protected $table = 'ticket_close_reasons';
    protected $fillable = [
        'ticket_id',
        'reason_text',
        'closed_by_id',
        'closed_at'
    ];
    
    protected $casts = [
        'closed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // RELATIONSHIP TO TICKET
    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    // RELATIONSHIP TO USER WHO CLOSED
    public function closedBy()
    {
        return $this->belongsTo(User::class, 'closed_by_id');
    }
}

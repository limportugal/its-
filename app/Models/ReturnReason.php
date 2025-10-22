<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReturnReason extends Model
{
    use HasFactory;

    protected $table = 'ticket_return_reasons';
    protected $fillable = [
        'ticket_id',
        'reason_text',
        'returned_by_id',
        'returned_at'
    ];
    
    protected $casts = [
        'returned_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // RELATIONSHIP TO TICKET
    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    // RELATIONSHIP TO USER WHO RETURNED
    public function returnedBy()
    {
        return $this->belongsTo(User::class, 'returned_by_id');
    }
}

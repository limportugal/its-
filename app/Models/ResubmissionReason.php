<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResubmissionReason extends Model
{
    use HasFactory;

    protected $table = 'ticket_resubmission_reasons';
    protected $fillable = [
        'ticket_id',
        'reason_text',
        'resubmitted_by_id',
        'resubmitted_at'
    ];
    
    protected $casts = [
        'resubmitted_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // RELATIONSHIP TO TICKET
    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    // RELATIONSHIP TO USER WHO RESUBMITTED
    public function resubmittedBy()
    {
        return $this->belongsTo(User::class, 'resubmitted_by_id');
    }

    // RELATIONSHIP TO ATTACHMENTS POLYMORPHIC
    public function attachments()
    {
        return $this->morphMany(Attachment::class, 'attachable')->orderBy('created_at', 'desc');
    }
}

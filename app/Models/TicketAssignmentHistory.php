<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketAssignmentHistory extends Model
{
    protected $table = 'ticket_assignment_history';

    protected $fillable = [
        'ticket_id',
        'assigned_by_user_id',
        'assigned_to_user_id',
        'assigned_at',
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
    ];

    // RELATIONSHIP WITH TICKET
    public function ticket()
    {
        return $this->belongsTo(Ticket::class, 'ticket_id');
    }

    // RELATIONSHIP WITH USER WHO ASSIGNED
    public function assignedBy()
    {
        return $this->belongsTo(User::class, 'assigned_by_user_id');
    }

    // RELATIONSHIP WITH USER WHO WAS ASSIGNED TO
    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to_user_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssignTicketToUser extends Model
{
    
    protected $table = 'assign_ticket_to_users';
    protected $fillable = [
        'ticket_id',
        'user_id',
        'created_at',
        'assigned_at',
        'updated_at',
    ];

    // RELATIONSHIP WITH TICKET
    public function ticket()
    {
        return $this->belongsTo(Ticket::class, 'ticket_id');
    }

    // RELATIONSHIP WITH USER
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}

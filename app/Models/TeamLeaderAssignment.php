<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUuid;

class TeamLeaderAssignment extends Model
{
    use HasFactory, HasUuid;
    protected $table = 'team_leader_assignments';
    protected $primaryKey = 'id';

    protected $fillable = [
        'uuid',
        'team_leader_id',
        'support_agent_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $hidden = [
        'pivot',
    ];

    public function teamLeader()
    {
        return $this->belongsTo(User::class, 'team_leader_id');
    }

    public function supportAgent()
    {
        return $this->belongsTo(User::class, 'support_agent_id');
    }
}

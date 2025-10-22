<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Notifications\Notifiable;
use App\Traits\HasUuid;
use App\Traits\HidesUserRolePivot;
use App\Models\TeamLeaderAssignment;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasRoles, Notifiable, HasUuid, HidesUserRolePivot;

    protected $table = 'users';
    protected $guard_name = 'web';
    protected $primaryKey = 'id';

    protected $fillable = [
        'id',
        'uuid',
        'name',
        'mobile_number',
        'email',
        'company_id',
        'status',
        'password',
        'created_at',
        'updated_at',
        'active_role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    protected $appends = ['avatar_url'];

    // USE UUID FOR ROUTE MODEL BINDING
    public function getRouteKeyName()
    {
        return 'uuid';
    }

    // CREATE A NEW USER RECORD WITH PASSWORD HASHING
    public static function createUser(array $data)
    {
        // $data['password'] = Hash::make($data['password']);
        return self::create($data);
    }

    // UPDATE EXISTING USER RECORD SAFELY
    public function updateUser(array $data)
    {
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }
        return $this->update($data);
    }

    // GET THE STATUS DISPLAY FORMAT
    public function getStatusDisplayAttribute()
    {
        return match($this->status) {
            'active' => 'Active',
            'inactive' => 'Inactive',
            'awaiting_password' => 'Awaiting Password',
            default => ucfirst($this->status ?? 'Unknown')
        };
    }

    // BELONGS TO RELATIONSHIP WITH COMPANY (ONE-TO-MANY)
    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    // BELONGS TO RELATIONSHIP WITH USER LOGS (ONE-TO-MANY)
    public function userLogs()
    {
        return $this->hasMany(UserLogs::class, 'user_id');
    }

    public function closedBy()
    {
        return $this->hasMany(Ticket::class, 'closed_ticket_by_id');
    }

    // CHECK IF USER HAS ANY ROLE
    public function hasAnyRole($roles)
    {
        if (is_string($roles)) {
            $roles = [$roles];
        }

        $userRoles = $this->roles->pluck('name')->toArray();

        foreach ($roles as $role) {
            if (in_array($role, $userRoles)) {
                return true;
            }
        }

        return false;
    }

    // BELONGS TO RELATIONSHIP WITH ROLES (MANY-TO-MANY)
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'model_has_roles', 'model_id', 'role_id');
    }

    // BELONGS TO RELATIONSHIP WITH TICKET (ONE-TO-MANY)
    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'user_id');
    }

    // BELONGS TO RELATIONSHIP WITH TICKET (ONE-TO-MANY)
    public function assignedTickets()
    {
        return $this->hasMany(AssignTicketToUser::class, 'user_id');
    }

    // POLYMORPHIC RELATIONSHIP WITH ATTACHMENTS
    public function attachments()
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }

    // GET PROFILE PICTURE ATTACHMENT
    public function profilePicture()
    {
        return $this->morphOne(Attachment::class, 'attachable')
                    ->where('category', 'profile_picture');
    }

    // GET PROFILE PICTURE URL FROM ATTACHMENT
    public function getAvatarUrlAttribute()
    {
        $profilePicture = $this->profilePicture()->first();
        
        if (!$profilePicture || !$profilePicture->uuid) {
            return null;
        }
        
        // USE UUID-BASED URL FOR BETTER SECURITY AND CONSISTENCY
        return url("/attachment/{$profilePicture->uuid}");
    }

    // MANY-TO-MANY RELATIONSHIP FOR TEAM LEADER ASSIGNMENTS
    public function teamLeaders()
    {
        return $this->belongsToMany(User::class, 'team_leader_assignments', 'support_agent_id', 'team_leader_id');
    }

    // MANY-TO-MANY RELATIONSHIP FOR SUPPORT AGENTS
    public function supportAgents()
    {
        return $this->belongsToMany(User::class, 'team_leader_assignments', 'team_leader_id', 'support_agent_id');
    }

    // HELPER METHODS TO CHECK USER ROLES
    public function isTeamLeader()
    {
        return $this->hasRole('Team Leader');
    }

    // CHECK IF USER HAS SUPPORT AGENT ROLE
    public function isSupportAgent()
    {
        return $this->hasRole('Support Agent');
    }
}

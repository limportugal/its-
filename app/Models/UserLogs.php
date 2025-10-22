<?php


namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
class UserLogs extends Model
{
    protected $table = 'user_logs';
    protected $fillable = [
        'id',
        'user_id',
        'activity',
        'ticket_number',
        "created_at",
        "updated_at",
    ];

    public static function logActivity($activity, $userId = null, $ticketNumber = null)
    {
        // TRY TO GET USER ID FROM PARAMETER, THEN FROM REQUEST, THEN FROM AUTH FACADE
        $userId = $userId ?? request()->user()?->id ?? Auth::id();
    
        // ALLOW LOGGING EVEN WITHOUT USER ID (FOR GUEST USERS OR SYSTEM ACTIONS)
        return self::create([
            'user_id' => $userId, // CAN BE NULL FOR GUEST USERS
            'activity' => $activity,
            'ticket_number' => $ticketNumber,
        ]);
    }
    
    public function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }
}


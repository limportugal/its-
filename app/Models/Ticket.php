<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Traits\HasUuid;

class Ticket extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'tickets';
    protected $primaryKey = 'id';

    protected $fillable = [
        'uuid',
        'full_name',
        'email',
        'ticket_number',
        'description',
        'status',
        'action_taken',
        
        // STORE FIELDS (FOR CUSTOMER NOT FOUND)
        'store_code',
        'store_name',
        'store_address',
        
        // FSR FIELD (FOR FSR ONLINE)
        'fsr_no',

        // POWERFORM FIELDS (FOR POWERFORM)
        'powerform_full_name',
        'powerform_employee_id',
        'powerform_email',
        'powerform_company_number',
        'powerform_imei',
        'powerform_store_code',
        'powerform_store_name',
        'powerform_store_address',
        'powerform_store_ownership',
        'powerform_store_type',

        // SERVICE LOGS FIELDS (FOR SERVICE LOGS SYSTEM + LOCATION ERROR)
        'service_logs_mobile_no',
        'service_logs_mobile_model',
        'service_logs_mobile_serial_no',
        'service_logs_imei',

        // KNOX FIELDS (FOR KNOX + CHANGE OWNERSHIP)
        'knox_full_name',
        'knox_employee_id',
        'knox_email',
        'knox_company_mobile_number',
        'knox_mobile_imei',

        //TIMESTAMP
        'closed_at',
        'expired_at',
        'created_at',
        'updated_at',
        'assigned_at',
        'returned_at',
        'cancelled_at',
        'reopened_at',
        'submitted_at',
        'follow_up_at',
        'reminded_at',
        'deleted_at',
        'restored_at',

        // FOREIGN KEYS
        'user_id',
        'priority_id',
        'system_id',
        'service_center_id',
        'assign_to_user_id',
        'assigned_by_id',
        'closed_ticket_by_id',
        'returned_by_id',
        'cancelled_ticket_by_id',
        'reopened_by_id',
        'follow_up_by_id',
        'reminded_by_id',
        'deleted_ticket_by_id',
        'restored_ticket_by_id',
    ];

    // GET ROUTE KEY NAME
    public function getRouteKeyName()
    {
        return 'uuid';
    }

    // CREATE TICKET
    public static function createTicket(array $data)
    {
        return self::create($data);
    }

    // UPDATE TICKET
    public function updateTicket(array $data)
    {
        return $this->update($data);
    }

    // RELATIONSHIP TO CREATOR OF THE TICKET ONE TO MANY
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // RELATIONSHIP TO ASSIGN TICKET TO USER MANY TO MANY
    public function assignToUsers()
    {
        return $this->hasMany(AssignTicketToUser::class, 'ticket_id');
    }

    // RELATIONSHIP TO ASSIGNMENT HISTORY
    public function assignmentHistory()
    {
        return $this->hasMany(TicketAssignmentHistory::class, 'ticket_id')->orderBy('assigned_at', 'desc');
    }

    // RELATIONSHIP TO PRIORITY ONE TO MANY
    public function priority()
    {
        return $this->belongsTo(Priority::class, 'priority_id');
    }

    // RELATIONSHIP TO SERVICE CENTER ONE TO MANY
    public function serviceCenter()
    {
        return $this->belongsTo(ServiceCenter::class, 'service_center_id');
    }

    // RELATIONSHIP TO SYSTEM ONE TO MANY
    public function system()
    {
        return $this->belongsTo(System::class, 'system_id');
    }

    // RELATIONSHIP TO CATEGORY MANY TO MANY
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'ticket_categories')->withTimestamps();
    }

    // RELATIONSHIP TO CLOSED BY USER ONE TO MANY
    public function closedBy()
    {
        return $this->belongsTo(User::class, 'closed_ticket_by_id');
    }


    // RELATIONSHIP TO ASSIGNED BY USER ONE TO MANY
    public function assignedBy()
    {
        return $this->belongsTo(User::class, 'assigned_by_id');
    }

    // RELATIONSHIP TO ASSIGN TICKET TO USER ONE TO MANY
    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assign_to_user_id');
    }

    public function returnedBy()
    {
        return $this->belongsTo(User::class, 'returned_by_id');
    }

    // RELATIONSHIP TO REOPENED BY USER ONE TO MANY
    public function reopenedBy()
    {
        return $this->belongsTo(User::class, 'reopened_by_id');
    }

    // RELATIONSHIP TO CANCELLED BY USER ONE TO MANY
    public function cancelledBy()
    {
        return $this->belongsTo(User::class, 'cancelled_ticket_by_id');
    }

    // RELATIONSHIP TO FOLLOW UP BY USER ONE TO MANY
    public function followUpBy()
    {
        return $this->belongsTo(User::class, 'follow_up_by_id');
    }

    // RELATIONSHIP TO REMINDED BY USER ONE TO MANY
    public function remindedBy()
    {
        return $this->belongsTo(User::class, 'reminded_by_id');
    }

    // RELATIONSHIP TO DELETED BY USER ONE TO MANY
    public function deletedBy()
    {
        return $this->belongsTo(User::class, 'deleted_ticket_by_id');
    }

    // RELATIONSHIP TO RESTORED BY USER ONE TO MANY
    public function restoredBy()
    {
        return $this->belongsTo(User::class, 'restored_ticket_by_id');
    }

    // RELATIONSHIP TO ATTACHMENTS POLYMORPHIC
    public function attachments()
    {
        return $this->morphMany(Attachment::class, 'attachable')->orderBy('created_at', 'desc');
    }

    // RELATIONSHIP TO RETURN REASONS (ONE TO MANY)
    public function returnReasons()
    {
        return $this->hasMany(ReturnReason::class);
    }

    // RELATIONSHIP TO RESUBMISSION REASONS (ONE TO MANY)
    public function resubmissionReasons()
    {
        return $this->hasMany(ResubmissionReason::class);
    }

    // RELATIONSHIP TO CANCELLATION REASONS (ONE TO MANY)
    public function cancellationReasons()
    {
        return $this->hasMany(CancellationReason::class);
    }

    // RELATIONSHIP TO REOPEN TICKET REASONS (ONE TO MANY)
    public function reopenReason()
    {
        return $this->hasMany(ReopenTicketReason::class);
    }

    // RELATIONSHIP TO CLOSE REASONS (ONE TO MANY)
    public function closeReasons()
    {
        return $this->hasMany(CloseReason::class);
    }

    // RELATIONSHIP TO FOLLOW UP REASONS (ONE TO MANY)
    public function followUpReasons()
    {
        return $this->hasMany(FollowUpReason::class);
    }

    // RELATIONSHIP TO REMINDER REASONS (ONE TO MANY)
    public function reminderReasons()
    {
        return $this->hasMany(TicketReminderReason::class);
    }

    // GET LATEST RETURN REASON
    public function getLatestReturnReason()
    {
        // If returnReasons are already loaded, use them instead of querying again
        if ($this->relationLoaded('returnReasons')) {
            return $this->returnReasons->sortByDesc('returned_at')->first();
        }
        
        return $this->returnReasons()->with(['returnedBy:id,uuid,name'])->latest('returned_at')->first();
    }

    // GET LATEST RESUBMISSION REASON
    public function getLatestResubmissionReason()
    {
        // If resubmissionReasons are already loaded, use them instead of querying again
        if ($this->relationLoaded('resubmissionReasons')) {
            return $this->resubmissionReasons->sortByDesc('resubmitted_at')->first();
        }
        
        return $this->resubmissionReasons()->with(['resubmittedBy:id,uuid,name', 'attachments'])->latest('resubmitted_at')->first();
    }

    // GET LATEST CANCELLATION REASON
    public function getLatestCancellationReason()
    {
        return $this->cancellationReasons()->latest()->first();
    }

    // GET LATEST REOPEN TICKET REASON
    public function getLatestReopenTicketReason()
    {
        return $this->reopenReason()->with(['reopenedBy:id,uuid,name'])->latest('reopened_at')->first();
    }

    // GET LATEST REOPEN REASON (alias for mail compatibility)
    public function getLatestReopenReason()
    {
        return $this->getLatestReopenTicketReason();
    }

    // GET LATEST REMINDER REASON
    public function getLatestReminderReason()
    {
        // If reminderReasons are already loaded, use them instead of querying again
        if ($this->relationLoaded('reminderReasons')) {
            return $this->reminderReasons->sortByDesc('reminded_at')->first();
        }
        
        return $this->reminderReasons()->with(['remindedBy:id,uuid,name'])->latest('reminded_at')->first();
    }

    // FORMAT API RESPONSE
    public function formatForResponse()
    {
        $this->loadMissing(['categories']);

        $this->categories->each(function ($category) {
            $category->makeHidden(['pivot']);
        });

        // Rename assignToUsers to assign_to_users to avoid redundancy in JSON response
        if ($this->relationLoaded('assignToUsers') && $this->assignToUsers) {
            $this->setAttribute('assign_to_users', $this->assignToUsers);
        }

        // Rename assignmentHistory to assignment_history to avoid redundancy in JSON response
        if ($this->relationLoaded('assignmentHistory') && $this->assignmentHistory) {
            $this->setAttribute('assignment_history', $this->assignmentHistory);
        }

        // Add latest reasons to the response
        $latestReturnReason = $this->getLatestReturnReason();
        $this->setAttribute('latest_return_reason', $latestReturnReason);
        $this->setAttribute('latest_resubmission_reason', $this->getLatestResubmissionReason());
        $this->setAttribute('latest_cancellation_reason', $this->getLatestCancellationReason());
        $this->setAttribute('latest_reminder_reason', $this->getLatestReminderReason());

        if ($this->latest_cancellation_reason) {
            $this->setAttribute('cancelled_by', $this->latest_cancellation_reason->cancelledBy);
        }

        return $this->makeHidden([
            'user_id',
            'assign_to_user_id',
            'priority_id',
            'closed_ticket_by_id',
            'assigned_by_id',
            'cancelled_ticket_by_id',
            'follow_up_by_id',
            'reminded_by_id',
            'assignToUsers', // Hide the original camelCase relationship to avoid redundancy
            'assignmentHistory', // Hide the original camelCase relationship to avoid redundancy
        ]);
    }
}

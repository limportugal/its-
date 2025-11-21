<?php

namespace App\Services\Ticket;

use App\Models\Ticket;
use App\Traits\HidesUserRolePivot;

class ViewCancelledTicketService
{
    use HidesUserRolePivot;

    public function getCancelledTicketByUuid($uuid)
    {
        $user = request()->user();
        $userRoles = $user->roles->pluck('name');
        $isAdmin = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        $isTeamLeader = $userRoles->contains('Team Leader');

        $viewCancelledTicket = Ticket::select(
            'id',
            'uuid',
            'full_name',
            'email',
            'ticket_number',
            'fsr_no',
            'store_code',
            'store_name',
            'store_address',
            'powerform_full_name',
            'powerform_employee_id',
            'powerform_email',
            'powerform_company_number',
            'powerform_imei',
            'service_logs_mobile_no',
            'service_logs_mobile_model',
            'service_logs_mobile_serial_no',
            'service_logs_imei',
            'description',
            'status',

            // TIMESTAMPS
            'assigned_at',
            'created_at',
            'returned_at',
            'cancelled_at',
            'closed_at',
            'reopened_at',

            // FOREIGN KEYS
            'system_id',
            'service_center_id',
            'priority_id',
            'assign_to_user_id',
            'assigned_by_id',
            'returned_by_id',
            'cancelled_ticket_by_id',
            'closed_ticket_by_id',
            'reopened_by_id',
       )
        ->with([
           // CATEGORIES
           'categories:id,category_name',

           // SYSTEM
           'system:id,system_name',

           // SERVICE CENTER
           'serviceCenter:id,service_center_name',

           // PRIORITY
           'priority:id,priority_name',

           // ASSIGNED USER
           'assignedUser:id,name',
           'assignedUser.roles:id,name',

           // ASSIGNED BY
           'assignedBy:id,name',
           'assignedBy.roles:id,name',

           // RETURNED BY
           'returnedBy:id,name',
           'returnedBy.roles:id,name',

           // RETURN REASONS
           'returnReasons:id,ticket_id,reason_text,returned_at',
           
           // RESUBMISSION REASONS
           'resubmissionReasons:id,ticket_id,reason_text,resubmitted_at',
           'resubmissionReasons.attachments:id,file_path,attachable_id,original_name,mime_type',
           
           // CANCELLED BY
           'cancelledBy:id,name',
           'cancelledBy.roles:id,name',
           
           // CANCELLATION REASONS
           'cancellationReasons:id,ticket_id,reason_text,cancelled_at',
           
           // CLOSED BY
           'closedBy:id,name',
           'closedBy.roles:id,name',
           
           // CLOSE REASONS
           'closeReasons:id,ticket_id,reason_text,closed_at',
           'closeReasons.closedBy:id,name,email,avatar_url',
           'closeReasons.closedBy.roles:id,name',
           
           // REOPENED BY
           'reopenedBy:id,name',
           'reopenedBy.roles:id,name',
           
           // REOPEN REASONS
           'reopenReason:id,ticket_id,reason_text,reopened_at',
           'reopenReason.reopenedBy:id,name',
           'reopenReason.reopenedBy.roles:id,name',
           
           // FOLLOW UP REASONS
           'followUpReasons:id,ticket_id,reason_text,follow_up_at',
           'followUpReasons.followUpBy:id,name',
           'followUpReasons.followUpBy.roles:id,name',

           // REMINDER REASONS
           'reminderReasons:id,ticket_id,reason_text,reminded_at',
           'reminderReasons.remindedBy:id,name',
           'reminderReasons.remindedBy.roles:id,name',

           // ATTACHMENTS
           'attachments:id,uuid,file_path,attachable_id,original_name,user_id,category,mime_type,created_at,updated_at',
        ])
            ->where('uuid', $uuid)
            ->where('status', 'cancelled')
            ->when(!$isAdmin, fn($q) => $q->where(function($query) use ($user, $isTeamLeader) {
                if ($isTeamLeader) {
                    // TEAM LEADERS CAN SEE:
                    // 1. TICKETS CREATED BY THEM
                    // 2. TICKETS ASSIGNED TO THEM
                    // 3. TICKETS ASSIGNED TO THEIR SUPPORT AGENTS
                    $supportAgentIds = $user->supportAgents->pluck('id')->toArray();
                    
                    $query->where('user_id', $user->id)
                          ->orWhere('assign_to_user_id', $user->id)
                          ->orWhereIn('assign_to_user_id', $supportAgentIds);
                } else {
                    // SUPPORT AGENTS CAN SEE TICKETS ASSIGNED TO THEM
                    $query->where('assign_to_user_id', $user->id);
                }
            }))
            ->firstOrFail();
       // HIDE PIVOT DATA FROM RETURN REASONS' RETURNED BY USERS
        if ($viewCancelledTicket->returnReasons) {
            $viewCancelledTicket->returnReasons->each(function ($returnReason) {
                $returnReason->makeHidden('returnedBy');
            });
        }

        // HIDE FOREIGN KEY FIELDS FROM RESPONSE
        $viewCancelledTicket->makeHidden([
            'system_id',
            'service_center_id',
            'priority_id',
            'assign_to_user_id',
            'assigned_by_id',
            'returned_by_id',
            'closed_ticket_by_id',
            'cancelled_ticket_by_id'
        ]);

        // HIDE PIVOT DATA FROM CATEGORIES
        if ($viewCancelledTicket->categories) {
            $viewCancelledTicket->categories->each(function ($category) {
                $category->makeHidden('pivot');
            });
        }

        // HIDE PIVOT DATA FROM CLOSE REASONS' CLOSED BY USERS
        if ($viewCancelledTicket->closeReasons) {
            $viewCancelledTicket->closeReasons->each(function ($closeReason) {
                $closeReason->makeHidden('closedBy');
            });
        }

        // HIDE PIVOT DATA FROM REOPEN REASONS' REOPENED BY USERS
        if ($viewCancelledTicket->reopenReason) {
            $viewCancelledTicket->reopenReason->each(function ($reopenReason) {
                $reopenReason->makeHidden('reopenedBy');
            });
        }

        // HIDE PIVOT DATA FROM FOLLOW UP REASONS' FOLLOW UP BY USERS
        if ($viewCancelledTicket->followUpReasons) {
            $viewCancelledTicket->followUpReasons->each(function ($followUpReason) {
                $followUpReason->makeHidden('followUpBy');
            });
        }

        // HIDE PIVOT DATA FROM REMINDER REASONS' REMINDED BY USERS
        if ($viewCancelledTicket->reminderReasons) {
            $viewCancelledTicket->reminderReasons->each(function ($reminderReason) {
                $reminderReason->makeHidden('remindedBy');
            });
        }

        // HIDE PIVOT DATA FROM USER ROLES
        $this->hideUserRolePivots($viewCancelledTicket, [
            'assignedUser',
            'assignedBy',
            'returnedBy',
            'cancelledBy',
            'closedBy',
            'reopenedBy'
        ]);

        return $viewCancelledTicket;
    }
}

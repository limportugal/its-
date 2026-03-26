<?php

namespace App\Services\Ticket;

use App\Models\Ticket;
use App\Traits\HidesUserRolePivot;

class ViewClosedTicketNumberService
{
    use HidesUserRolePivot;
    public function getClosedTicketByUuid($uuid)
    {
        $user = request()->user();
        $userRoles = $user->roles->pluck('name');
        $isAdmin = $userRoles->contains(fn($role) => in_array($role, ['Super Admin', 'Admin', 'Manager']));
        $isTeamLeader = $userRoles->contains('Team Leader');
        $isSupportAgent = $userRoles->contains('Support Agent');

        $viewClosedTicketNumber = Ticket::select(
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
            'powerform_client_name',
            'powerform_store_code',
            'powerform_store_name',
            'powerform_store_address',
            'powerform_store_ownership',
            'powerform_store_type',
            'service_logs_mobile_no',
            'service_logs_mobile_model',
            'service_logs_mobile_serial_no',
            'service_logs_imei',
            'knox_full_name',
            'knox_employee_id',
            'knox_email',
            'knox_company_mobile_number',
            'knox_mobile_imei',
            'description',
            'status',
            'action_taken',

            // TIMESTAMPS
            'assigned_at',
            'created_at',
            'returned_at',
            'reopened_at',
            'closed_at',

            // FOREIGN KEYS
            'system_id',
            'service_center_id',
            'priority_id',
            'assign_to_user_id',
            'assigned_by_id',
            'returned_by_id',
            'reopened_by_id',
            'closed_ticket_by_id',
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

            // ASSIGNMENT HISTORY
            'assignmentHistory:id,ticket_id,assigned_by_user_id,assigned_at',
            'assignmentHistory.assignedBy:id,uuid,name',
            'assignmentHistory.assignedBy.roles:id,name',

            // ASSIGNMENT TO USERS
            'assignToUsers:id,ticket_id,user_id,assigned_at',
            'assignToUsers.user:id,uuid,name',
            'assignToUsers.user.roles:id,name',
 
            // RETURNED BY
            'returnedBy:id,name',
            'returnedBy.roles:id,name',
 
            // REOPENED BY
            'reopenedBy:id,name',
            'reopenedBy.roles:id,name',
 
            // RETURN REASONS
            'returnReasons:id,ticket_id,reason_text,returned_at',
            
            // REOPEN REASONS
            'reopenReason:id,ticket_id,reason_text,reopened_at',
            'reopenReason.reopenedBy:id,name',
            'reopenReason.reopenedBy.roles:id,name',
            
            // RESUBMISSION REASONS
            'resubmissionReasons:id,ticket_id,reason_text,resubmitted_at',
            'resubmissionReasons.attachments:id,file_path,attachable_id,original_name,mime_type',
            
            // CLOSE REASONS
            'closeReasons:id,ticket_id,reason_text,closed_at',
            'closeReasons.closedBy:id,name,email',
            'closeReasons.closedBy.roles:id,name',
            
            // FOLLOW UP REASONS
            'followUpReasons:id,ticket_id,reason_text,follow_up_at',
            'followUpReasons.followUpBy:id,name',
            'followUpReasons.followUpBy.roles:id,name',
            
            // REMINDER REASONS
            'reminderReasons:id,ticket_id,reason_text,reminded_at',
            'reminderReasons.remindedBy:id,name',
            'reminderReasons.remindedBy.roles:id,name',
            
            // CLOSED BY
            'closedBy:id,name',
            'closedBy.roles:id,name',
            
            // ATTACHMENTS
            'attachments:id,uuid,file_path,attachable_id,original_name,user_id,category,mime_type',
        ])
            ->where('uuid', $uuid)
            ->where('status', 'closed')
            ->when(!$isAdmin, fn($q) => $q->where(function($query) use ($user, $isTeamLeader, $isSupportAgent) {
                if ($isTeamLeader) {
                    // TEAM LEADERS CAN SEE:
                    // 1. TICKETS CREATED BY THEM
                    // 2. TICKETS ASSIGNED TO THEM (both single and multi-assignment)
                    // 3. TICKETS ASSIGNED TO THEIR SUPPORT AGENTS (both single and multi-assignment)
                    $supportAgentIds = $user->supportAgents->pluck('id')->toArray();

                    $query->where('user_id', $user->id)
                          ->orWhere('assign_to_user_id', $user->id)
                          ->orWhereHas('assignToUsers', function($assignQuery) use ($user) {
                              $assignQuery->where('user_id', $user->id);
                          })
                          ->orWhereIn('assign_to_user_id', $supportAgentIds)
                          ->orWhereHas('assignToUsers', function($assignQuery) use ($supportAgentIds) {
                              $assignQuery->whereIn('user_id', $supportAgentIds);
                          });
                } elseif ($isSupportAgent) {
                    // SUPPORT AGENTS CAN SEE:
                    // 1. TICKETS CREATED BY THEM
                    // 2. TICKETS ASSIGNED TO THEM (both single and multi-assignment)
                    $query->where('user_id', $user->id)
                          ->orWhere('assign_to_user_id', $user->id)
                          ->orWhereHas('assignToUsers', function($assignQuery) use ($user) {
                              $assignQuery->where('user_id', $user->id);
                          });
                } else {
                    // OTHER NON-ADMIN USERS CAN SEE:
                    // 1. TICKETS CREATED BY THEM
                    // 2. TICKETS ASSIGNED TO THEM (both single and multi-assignment)
                    $query->where('user_id', $user->id)
                          ->orWhere('assign_to_user_id', $user->id)
                          ->orWhereHas('assignToUsers', function($assignQuery) use ($user) {
                              $assignQuery->where('user_id', $user->id);
                          });
                }
            }))
            ->firstOrFail();

        // HIDE PIVOT DATA FROM USER ROLES
       $this->hideUserRolePivots($viewClosedTicketNumber, ['assignedUser', 'assignedBy', 'returnedBy', 'reopenedBy', 'closedBy']);

       // HIDE PIVOT DATA FROM RETURN REASONS' RETURNED BY USERS
       if ($viewClosedTicketNumber->returnReasons) {
           $viewClosedTicketNumber->returnReasons->each(function ($returnReason) {
                $returnReason->makeHidden('returnedBy');
           });
       }

       // HIDE PIVOT DATA FROM REOPEN REASONS' REOPENED BY USERS
       if ($viewClosedTicketNumber->reopenReason) {
           $viewClosedTicketNumber->reopenReason->each(function ($reopenReason) {
                $reopenReason->makeHidden('reopenedBy');
           });
       }

       // NOTE: Keeping user data visible for frontend display of multiple assigned users
       // HIDE PIVOT DATA FROM ASSIGNMENT HISTORY USERS - Commented out to show user info
       // if ($viewClosedTicketNumber->assignToUsers) {
       //     $viewClosedTicketNumber->assignToUsers->each(function ($assignment) {
       //          $assignment->makeHidden('user');
       //     });
       // }

       // HIDE PIVOT DATA FROM RESUBMISSION REASONS' RETURNED BY USERS
       if ($viewClosedTicketNumber->resubmissionReasons) {
           $viewClosedTicketNumber->resubmissionReasons->each(function ($resubmissionReason) {
                $resubmissionReason->makeHidden('returnedBy');
           });
       }

       // HIDE PIVOT DATA FROM CLOSE REASONS' CLOSED BY USERS
       if ($viewClosedTicketNumber->closeReasons) {
           $viewClosedTicketNumber->closeReasons->each(function ($closeReason) {
                $closeReason->makeHidden('closedBy');
           });
       }

       // HIDE PIVOT DATA FROM FOLLOW UP REASONS' FOLLOW UP BY USERS
       if ($viewClosedTicketNumber->followUpReasons) {
           $viewClosedTicketNumber->followUpReasons->each(function ($followUpReason) {
                $followUpReason->makeHidden('followUpBy');
           });
       }

       // HIDE PIVOT DATA FROM REMINDER REASONS' REMINDED BY USERS
       if ($viewClosedTicketNumber->reminderReasons) {
           $viewClosedTicketNumber->reminderReasons->each(function ($reminderReason) {
                $reminderReason->makeHidden('remindedBy');
           });
       }

       // HIDE FOREIGN KEY FIELDS FROM RESPONSE
       $viewClosedTicketNumber->makeHidden([
           'system_id',
           'service_center_id',
           'priority_id',
           'assign_to_user_id',
           'assigned_by_id',
           'returned_by_id',
           'reopened_by_id',
           'closed_ticket_by_id'
       ]);

       // HIDE PIVOT DATA FROM CATEGORIES
       if ($viewClosedTicketNumber->categories) {
           $viewClosedTicketNumber->categories->each(function ($category) {
               $category->makeHidden('pivot');
           });
       }

        return $viewClosedTicketNumber;
    }
}

<?php

namespace App\Services\Ticket;

use App\Models\Ticket;
use App\Traits\HidesUserRolePivot;

class ViewDeletedTicketNumberService
{
    use HidesUserRolePivot;

   public function getViewDeletedTicketData($uuid)
   {
       $viewDeletedTicketNumber = Ticket::select(
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
            'description',
            'status',

            // TIMESTAMPS
            'assigned_at',
            'created_at',
            'returned_at',
            'reopened_at',
            'closed_at',
            'deleted_at',
            'restored_at',

            // FOREIGN KEYS
            'system_id',
            'service_center_id',
            'priority_id',
            'assign_to_user_id',
            'assigned_by_id',
            'returned_by_id',
            'reopened_by_id',
            'closed_ticket_by_id',
            'deleted_ticket_by_id',
            'restored_ticket_by_id',
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
           'assignToUsers:id,ticket_id,user_id,assigned_at',
           'assignToUsers.user:id,name',
           'assignToUsers.user.roles:id,name',

           // RETURNED BY
           'returnedBy:id,name',
           'returnedBy.roles:id,name',

           // REOPENED BY
           'reopenedBy:id,name',
           'reopenedBy.roles:id,name',

           // CLOSED BY
           'closedBy:id,name',
           'closedBy.roles:id,name',

           // DELETED BY
           'deletedBy:id,name',
           'deletedBy.roles:id,name',

           // RESTORED BY
           'restoredBy:id,name',
           'restoredBy.roles:id,name',

           // RETURN REASONS
           'returnReasons:id,ticket_id,reason_text,returned_at',
           
           // REOPEN REASONS
           'reopenReason:id,ticket_id,reason_text,reopened_at',
           'reopenReason.reopenedBy:id,name',
           'reopenReason.reopenedBy.roles:id,name',
           
           // CLOSE REASONS
           'closeReasons:id,ticket_id,reason_text,closed_at',
           'closeReasons.closedBy:id,name',
           'closeReasons.closedBy.roles:id,name',
           
           // RESUBMISSION REASONS
           'resubmissionReasons:id,ticket_id,reason_text,resubmitted_at',
           'resubmissionReasons.attachments:id,file_path,attachable_id,original_name,mime_type',
           
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
           ->whereIn('status', ['deleted'])
           ->orderBy('deleted_at', 'desc')
           ->firstOrFail();
       
       // HIDE PIVOT DATA FROM USER ROLES
       $this->hideUserRolePivots($viewDeletedTicketNumber, ['assignedUser', 'assignedBy', 'returnedBy', 'reopenedBy', 'closedBy', 'deletedBy']);
       
       // HIDE PIVOT DATA FROM RETURN REASONS' RETURNED BY USERS
       if ($viewDeletedTicketNumber->returnReasons) {
           $viewDeletedTicketNumber->returnReasons->each(function ($returnReason) {
                $returnReason->makeHidden('returnedBy');
           });
       }

       // HIDE PIVOT DATA FROM REOPEN REASONS' REOPENED BY USERS
       if ($viewDeletedTicketNumber->reopenReason) {
           $viewDeletedTicketNumber->reopenReason->each(function ($reopenReason) {
                $reopenReason->makeHidden('reopenedBy');
           });
       }

       // HIDE PIVOT DATA FROM ASSIGNMENT HISTORY USERS
       if ($viewDeletedTicketNumber->assignToUsers) {
           $viewDeletedTicketNumber->assignToUsers->each(function ($assignment) {
                $assignment->makeHidden('user');
           });
       }

       // HIDE PIVOT DATA FROM CLOSE REASONS' CLOSED BY USERS
       if ($viewDeletedTicketNumber->closeReasons) {
           $viewDeletedTicketNumber->closeReasons->each(function ($closeReason) {
                $closeReason->makeHidden('closedBy');
           });
       }

       // HIDE PIVOT DATA FROM FOLLOW UP REASONS' FOLLOW UP BY USERS
       if ($viewDeletedTicketNumber->followUpReasons) {
           $viewDeletedTicketNumber->followUpReasons->each(function ($followUpReason) {
                $followUpReason->makeHidden('followUpBy');
           });
       }

       // HIDE PIVOT DATA FROM REMINDER REASONS' REMINDED BY USERS
       if ($viewDeletedTicketNumber->reminderReasons) {
           $viewDeletedTicketNumber->reminderReasons->each(function ($reminderReason) {
                $reminderReason->makeHidden('remindedBy');
           });
       }

        // HIDE FOREIGN KEY FIELDS FROM RESPONSE
        $viewDeletedTicketNumber->makeHidden([
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
        if ($viewDeletedTicketNumber->categories) {
            $viewDeletedTicketNumber->categories->each(function ($category) {
                $category->makeHidden('pivot');
            });
        }

       return $viewDeletedTicketNumber;
   }
}

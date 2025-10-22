<?php

namespace App\Services\Ticket;

use App\Models\Ticket;
use App\Traits\HidesUserRolePivot;

class ViewResubmitTicketService
{
    use HidesUserRolePivot;

    public function getTicketDataForResubmit(string $uuid): array
    {
        $ticket = Ticket::select([
            'id',
            'uuid',
            'ticket_number',
            'status',
            'full_name',
            'email',
            'description',
            'created_at',
            'returned_by_id',
            'returned_at',
            'reminded_by_id',
            'reminded_at',
        ])
        ->with([
            // RETURNED BY USER WITH ROLES
            'returnedBy:id,uuid,name,email,company_id',
            'returnedBy.roles:id,name',
            'returnedBy.company:id,company_name',
            'returnedBy.profilePicture',
            
            // REMINDED BY USER WITH ROLES
            'remindedBy:id,uuid,name,email,company_id',
            'remindedBy.roles:id,name',
            'remindedBy.company:id,company_name',
            'remindedBy.profilePicture',
            
            // LATEST RETURN REASON WITH RETURNED BY USER
            'returnReasons' => function($query) {
                $query->select('id', 'ticket_id', 'reason_text', 'returned_by_id', 'returned_at')
                      ->with(['returnedBy:id,uuid,name,email,company_id'])
                      ->orderBy('returned_at', 'desc')
                      ->limit(1);
            },
            
            // LATEST REMINDER REASON WITH REMINDED BY USER
            'reminderReasons' => function($query) {
                $query->select('id', 'ticket_id', 'reason_text', 'reminded_by_id', 'reminded_at')
                      ->with(['remindedBy:id,uuid,name,email,company_id'])
                      ->orderBy('reminded_at', 'desc')
                      ->limit(1);
            },
            
            // ATTACHMENTS
            'attachments:id,uuid,file_path,attachable_id,original_name,user_id,category,mime_type,created_at,updated_at',
        ])
        ->where('uuid', $uuid)
        ->whereIn('status', ['returned', 'closed', 'cancelled', 'resubmitted', 'reminder'])
        ->firstOrFail();

        // HIDE PIVOT DATA FROM USER ROLES
        $this->hideUserRolePivots($ticket, ['returnedBy', 'remindedBy']);

        // GET THE LATEST RETURN REASON
        $latestReturnReason = $ticket->returnReasons->first();

        // GET THE LATEST REMINDER REASON
        $latestReminderReason = $ticket->reminderReasons->first();

        // ENSURE AVATAR_URL IS AVAILABLE FOR RETURNED BY USER
        if ($ticket->returnedBy) {
            $ticket->returnedBy->makeVisible(['avatar_url']);
        }

        // ENSURE AVATAR_URL IS AVAILABLE FOR REMINDED BY USER
        if ($ticket->remindedBy) {
            $ticket->remindedBy->makeVisible(['avatar_url']);
        }

        // ENSURE AVATAR_URL IS AVAILABLE FOR RETURN REASON'S RETURNED BY USER
        if ($latestReturnReason && $latestReturnReason->returnedBy) {
            $latestReturnReason->returnedBy->makeVisible(['avatar_url']);
        }

        // ENSURE AVATAR_URL IS AVAILABLE FOR REMINDER REASON'S REMINDED BY USER
        if ($latestReminderReason && $latestReminderReason->remindedBy) {
            $latestReminderReason->remindedBy->makeVisible(['avatar_url']);
        }

        return [
            'ticket' => $ticket,
            'latest_return_reason' => $latestReturnReason,
            'returned_by_user' => $ticket->returnedBy,
            'latest_reminder_reason' => $latestReminderReason,
            'reminded_by_user' => $ticket->remindedBy,
        ];
    }
}

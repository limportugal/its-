<?php

namespace App\Services\Ticket;

use App\Models\Ticket;
use App\Traits\HidesUserRolePivot;

class DeletedTicketsService
{
    use HidesUserRolePivot;

    public function getDeletedTickets()
    {
        $query = Ticket::query()
            ->select([
                'id',
                'uuid',
                'full_name',
                'email',
                'ticket_number',
                'fsr_no',
                'store_code',
                'store_name',
                'store_address',
                'description',
                'created_at',
                'status',
                'deleted_at',
                'deleted_ticket_by_id',
                'priority_id',
                'service_center_id',
                'system_id',
            ])
            ->with([
                'categories:id,category_name',
                'deletedBy:id,name',
                'deletedBy.roles:id,name',
                'priority:id,priority_name',
                'assignedUser:id,name',
                'assignedUser.roles:id,name',
                'assignToUsers:id,ticket_id,user_id,assigned_at',
                'assignToUsers.user:id,name,avatar_url',
                'assignToUsers.user.roles:id,name',
                'serviceCenter:id,service_center_name',
                'system:id,system_name'
            ])
            ->whereIn('status', ['deleted'])
            ->orderBy('deleted_at', 'desc');

        $tickets = $query->get();

        $deletedTickets = $tickets->map(function ($ticket) {
            $baseTicket = $ticket->formatForResponse();

            unset($baseTicket->deleted_by);
            unset($baseTicket->deleted_ticket_by_id);

            // HIDE ROLE PIVOTS FROM ANY REMAINING USER RELATIONS
            $this->hideUserRolePivots($baseTicket, ['deletedBy']);

            // REMOVE REDUNDANT REASON FIELDS
            unset($baseTicket->latest_cancellation_reason);
            unset($baseTicket->latest_return_reason);
            unset($baseTicket->latest_resubmission_reason);

            // HIDE SPECIFIC FIELDS
            unset($baseTicket->service_center_id);
            unset($baseTicket->system_id);

            return $baseTicket;
        });

        return [
            'deleted_tickets' => $deletedTickets
        ];
    }
}

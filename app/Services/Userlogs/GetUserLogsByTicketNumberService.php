<?php

namespace App\Services\Userlogs;

use App\Models\UserLogs;
use App\Traits\HidesUserRolePivot;

class GetUserLogsByTicketNumberService
{
    use HidesUserRolePivot;

    public function getUserLogsByTicketNumber(string $ticketNumber)
    {
        $userLogsTicketNumberById = UserLogs::with([
            'user:id,name,email',
            'user.roles:id,name'
        ])
            ->where(function($query) use ($ticketNumber) {
                // INCLUDE ALL RECORDS WITH EXACT TICKET NUMBER MATCH
                $query->where('ticket_number', $ticketNumber)
                      // ALSO INCLUDE RECORDS WHERE ACTIVITY CONTAINS THE TICKET NUMBER
                      ->orWhere('activity', 'like', '%' . $ticketNumber . '%');
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->makeHidden('user_id');

        // HIDE PIVOT DATA FROM USER ROLES
        $this->hideUserRolePivots($userLogsTicketNumberById, ['user']);
        return $userLogsTicketNumberById;
    }
}

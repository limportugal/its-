<?php

namespace App\Services\Ticket;

use App\Models\Ticket;
use App\Models\User;
use App\Models\AssignTicketToUser;
use App\Models\UserLogs;
use App\Jobs\SendTicketAssignedEmail;
use App\Jobs\SendTicketAssignedToCreatorEmail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class AssignToUserTicketService
{
    use AuthorizesRequests;

    public function assignTicketToUser(string $ticketUuid, string $userUuid)
    {
        return DB::transaction(function () use ($ticketUuid, $userUuid) {
            $ticket = Ticket::with('assignedUser')
                ->where('uuid', $ticketUuid)
                ->firstOrFail();

            // AUTHORIZE USING POLICY
            $this->authorize('assign', $ticket);

            $assignedUser = User::where('uuid', $userUuid)->firstOrFail();

            if ($ticket->assign_to_user_id == $assignedUser->id) {
                return [
                    'success' => false,
                    'message' => 'Ticket is already assigned to this user.',
                ];
            }

            AssignTicketToUser::create([
                'ticket_id' => $ticket->id,
                'user_id' => $assignedUser->id,
                'assigned_at' => now(),
            ]);

            $ticket->update([
                'assign_to_user_id' => $assignedUser->id,
                'status' => $ticket->status === 'returned' ? 'returned' : 'assigned',
                'assigned_by_id' => Auth::id(),
                'assigned_at' => now(),
            ]);

            // Reload the ticket with the updated assignedUser relationship
            $ticket = $ticket->fresh(['assignedUser']);

            // LOG ACTIVITY
            $assignedUserRole = $assignedUser->roles->first()->name ?? 'Unknown Role';
            UserLogs::logActivity("Ticket was assigned to ($assignedUser->name | $assignedUserRole).", Auth::id(), $ticket->ticket_number);

            // Send notification to assigned user (outside transaction to avoid rollback on email failure)
            if (!empty($assignedUser->email)) {
                SendTicketAssignedEmail::dispatch($ticket);
            }

            // Send notification to ticket creator (outside transaction to avoid rollback on email failure)
            if (!empty($ticket->email)) {
                SendTicketAssignedToCreatorEmail::dispatch($ticket);
            }

            return [
                'success' => true,
                'message' => 'Ticket successfully re-assigned',
                'data' => [
                    'assigned_by_id' => Auth::id(),
                    'ticket_number' => $ticket->ticket_number,
                    'assign_to_user_id' => $ticket->assign_to_user_id,
                    'assigned_to_name' => $assignedUser->name,
                    'assigned_user_email' => $assignedUser->email,
                    'assigned_users' => $ticket->assignToUsers->map(function ($assign) {
                        return [
                            'user_id' => $assign->user->id,
                            'user_name' => $assign->user->name,
                            'user_email' => $assign->user->email,
                        ];
                    })
                ]
            ];
        });
    }
}

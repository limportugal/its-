<?php

namespace App\Services\Ticket;

use App\Models\Ticket;
use App\Models\User;
use App\Models\AssignTicketToUser;
use App\Models\TicketAssignmentHistory;
use App\Models\UserLogs;
use App\Jobs\SendTicketAssignedEmail;
use App\Jobs\SendTicketAssignedToCreatorEmail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class AssignToUserTicketService
{
    use AuthorizesRequests;

    public function assignTicketToUser(string $ticketUuid, array $userUuids)
    {
        return DB::transaction(function () use ($ticketUuid, $userUuids) {
            $ticket = Ticket::with('assignedUser')
                ->where('uuid', $ticketUuid)
                ->firstOrFail();

            // AUTHORIZE USING POLICY
            $this->authorize('assign', $ticket);

            if (empty($userUuids)) {
                // If no users selected, remove all assignments (unassign the ticket)
                AssignTicketToUser::where('ticket_id', $ticket->id)->delete();

                $ticket->update([
                    'assign_to_user_id' => null,
                    'assigned_by_id' => null,
                    'assigned_at' => null,
                    'status' => 'new_ticket',
                ]);

                UserLogs::logActivity("All ticket assignments removed.", Auth::id(), $ticket->ticket_number);

                return [
                    'success' => true,
                    'message' => 'Ticket unassigned from all users',
                    'data' => [
                        'assigned_by_id' => null,
                        'ticket_number' => $ticket->ticket_number,
                        'assign_to_user_id' => null,
                        'assigned_to_name' => null,
                        'assigned_user_email' => null,
                        'assigned_users' => []
                    ]
                ];
            }

            // Get all users to be assigned
            $assignedUsers = User::whereIn('uuid', $userUuids)->get();

            if ($assignedUsers->count() !== count($userUuids)) {
                return [
                    'success' => false,
                    'message' => 'One or more selected users could not be found.',
                ];
            }

            $assignedUserNames = [];

            // DELETE ALL EXISTING ASSIGNMENTS FOR THIS TICKET (CreateUpdate pattern)
            $oldAssignments = AssignTicketToUser::where('ticket_id', $ticket->id)->get();
            AssignTicketToUser::where('ticket_id', $ticket->id)->delete();

            // Log removal activity for old assignments
            foreach ($oldAssignments as $oldAssignment) {
                $oldUser = $oldAssignment->user;
                if ($oldUser) {
                    $oldUserRole = $oldUser->roles->first()->name ?? 'Unknown Role';
                    UserLogs::logActivity("Ticket assignment removed from ($oldUser->name | $oldUserRole).", Auth::id(), $ticket->ticket_number);
                }
            }

            // CREATE NEW ASSIGNMENTS
            foreach ($assignedUsers as $assignedUser) {
                AssignTicketToUser::create([
                    'ticket_id' => $ticket->id,
                    'user_id' => $assignedUser->id,
                    'assigned_at' => now(),
                ]);

                // LOG ACTIVITY for newly assigned users
                $assignedUserRole = $assignedUser->roles->first()->name ?? 'Unknown Role';
                UserLogs::logActivity("Ticket was assigned to ($assignedUser->name | $assignedUserRole).", Auth::id(), $ticket->ticket_number);

                // Send notification to newly assigned user
                if (!empty($assignedUser->email)) {
                    SendTicketAssignedEmail::dispatch($ticket);
                }

                $assignedUserNames[] = $assignedUser->name;
            }

            // Update ticket with the first assigned user as primary assignee
            $primaryAssignedUser = $assignedUsers->first();
            $assignedAt = now();
            $ticket->update([
                'assign_to_user_id' => $primaryAssignedUser->id,
                'status' => $ticket->status === 'returned' ? 'returned' : 'assigned',
                'assigned_by_id' => Auth::id(),
                'assigned_at' => $assignedAt,
            ]);

            // Create assignment history record for tracking who assigned the ticket
            TicketAssignmentHistory::create([
                'ticket_id' => $ticket->id,
                'assigned_by_user_id' => Auth::id(),
                'assigned_to_user_id' => $primaryAssignedUser->id,
                'assigned_at' => $assignedAt,
            ]);

            // Reload the ticket with the updated assignedUser relationship
            $ticket = $ticket->fresh(['assignedUser']);

            // Send notification to ticket creator (outside transaction to avoid rollback on email failure)
            if (!empty($ticket->email)) {
                SendTicketAssignedToCreatorEmail::dispatch($ticket);
            }

            $assignedUsersList = implode(', ', $assignedUserNames);

            return [
                'success' => true,
                'message' => count($assignedUsers) > 1
                    ? "Ticket successfully assigned to multiple users: $assignedUsersList"
                    : 'Ticket successfully assigned',
                'data' => [
                    'assigned_by_id' => Auth::id(),
                    'ticket_number' => $ticket->ticket_number,
                    'assign_to_user_id' => $ticket->assign_to_user_id,
                    'assigned_to_name' => $primaryAssignedUser->name,
                    'assigned_user_email' => $primaryAssignedUser->email,
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

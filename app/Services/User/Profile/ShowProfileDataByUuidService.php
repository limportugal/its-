<?php

namespace App\Services\User\Profile;
use App\Models\User;
use App\Models\Ticket;

class ShowProfileDataByUuidService
{
    public function getProfileDataByUuid(string $uuid): array
    {
        if (empty($uuid)) {
            throw new \InvalidArgumentException('UUID cannot be empty or null.');
        }
        
        $user = User::select(
            'id',
            'uuid',
            'created_at',
            'name',
            'email',
            'company_id',
            'status'
        )
        ->where('uuid', $uuid)
            ->with([
                'roles:id,name', 
                'company:id,company_name', 
                'profilePicture',
                'supportAgents' => function($query) {
                    $query->select(
                        'users.id', 
                        'users.uuid', 
                        'users.name', 
                        'users.email', 
                        'users.company_id', 
                        'users.status', 
                        'users.created_at'
                        )
                          ->with(['company:id,company_name', 'roles:id,name', 'profilePicture'])
                          ->where('users.status', 'active')
                          ->orderBy('users.name');
                },
                'teamLeaders' => function($query) {
                    $query->select(
                        'users.id', 
                        'users.uuid', 
                        'users.name', 
                        'users.email', 
                        'users.company_id', 
                        'users.status', 
                        'users.created_at'
                        )
                          ->with(['company:id,company_name', 'roles:id,name', 'profilePicture'])
                          ->where('users.status', 'active');
                }
            ])
            ->firstOrFail();

        // GET TICKET COUNTS FOR THIS USER (EXCLUDING DELETED STATUS)
        $validStatuses = collect(['re-open', 'closed', 'resubmitted', 'new_ticket', 'returned', 'cancelled', 'assigned']);
        
        // GET ALL TICKET COUNTS FOR THIS USER (TOTAL COUNTS)
        $ticketCounts = Ticket::select('status')
            ->selectRaw('COUNT(*) as count')
            ->where('assign_to_user_id', $user->id)
            ->whereIn('status', $validStatuses)
            ->groupBy('status')
            ->pluck('count', 'status');

        $statusSummary = $validStatuses->mapWithKeys(fn($status) => [$status => 0])
            ->merge($ticketCounts);

        // CALCULATE SPECIFIC METRICS
        $totalTickets = $statusSummary->sum(); // Total excluding deleted
        $closedTickets = $statusSummary->get('closed', 0);
        $assignedTickets = $statusSummary->get('assigned', 0);
        $returnedTickets = $statusSummary->get('returned', 0);
        $cancelledTickets = $statusSummary->get('cancelled', 0);
        $resubmittedTickets = $statusSummary->get('resubmitted', 0);
        $reopenTickets = $statusSummary->get('re-open', 0);

        // GET THE MOST RECENT ACTIVITY FOR EACH STATUS TYPE (ONE PER TYPE)
        $recentActivitiesByType = [];
        
        foreach ($validStatuses as $status) {
            $mostRecentTicket = Ticket::with('priority')
                ->select(
                    'id',
                    'ticket_number', 
                    'status',
                    'priority_id',
                    'assigned_at',
                    'closed_at',
                    'returned_at',
                    'reopened_at',
                    'cancelled_at',
                    'submitted_at'
                )
                ->where('assign_to_user_id', $user->id)
                ->where('status', $status)
                ->orderBy('updated_at', 'desc')
                ->first();

            if ($mostRecentTicket) {
                $activityType = '';
                $description = '';
                $time = '';
                $icon = '';
                $priority = $mostRecentTicket->priority ? strtolower($mostRecentTicket->priority->priority_name) : 'medium';

                switch ($mostRecentTicket->status) {
                    case 'assigned':
                        $activityType = 'Assigned';
                        $description = "Ticket {$mostRecentTicket->ticket_number} has been assigned";
                        $time = $mostRecentTicket->assigned_at ? \Carbon\Carbon::parse($mostRecentTicket->assigned_at)->diffForHumans() : 'Recently';
                        $icon = '🎯';
                        break;
                    case 'closed':
                        $activityType = 'Recent Closed';
                        $description = "Ticket {$mostRecentTicket->ticket_number} has been resolved";
                        $time = $mostRecentTicket->closed_at ? \Carbon\Carbon::parse($mostRecentTicket->closed_at)->diffForHumans() : 'Recently';
                        $icon = '✅';
                        break;
                    case 'returned':
                        $activityType = 'Recent Returned';
                        $description = "Ticket {$mostRecentTicket->ticket_number} has been returned";
                        $time = $mostRecentTicket->returned_at ? \Carbon\Carbon::parse($mostRecentTicket->returned_at)->diffForHumans() : 'Recently';
                        $icon = '🔄';
                        break;
                    case 're-open':
                        $activityType = 'Recent Re-open';
                        $description = "Ticket {$mostRecentTicket->ticket_number} has been reopened";
                        $time = $mostRecentTicket->reopened_at ? \Carbon\Carbon::parse($mostRecentTicket->reopened_at)->diffForHumans() : 'Recently';
                        $icon = '🔄';
                        break;
                    case 'cancelled':
                        $activityType = 'Recent Cancelled';
                        $description = "Ticket {$mostRecentTicket->ticket_number} has been cancelled";
                        $time = $mostRecentTicket->cancelled_at ? \Carbon\Carbon::parse($mostRecentTicket->cancelled_at)->diffForHumans() : 'Recently';
                        $icon = '❌';
                        break;
                    case 'resubmitted':
                        $activityType = 'Recent Resubmitted';
                        $description = "Ticket {$mostRecentTicket->ticket_number} has been resubmitted";
                        $time = $mostRecentTicket->submitted_at ? \Carbon\Carbon::parse($mostRecentTicket->submitted_at)->diffForHumans() : 'Recently';
                        $icon = '🔄';
                        break;
                    default:
                        $activityType = 'Recent Activity';
                        $description = "Ticket {$mostRecentTicket->ticket_number} status updated";
                        $time = 'Recently';
                        $icon = '📋';
                }

                // GET THE CORRECT TIMESTAMP FOR SORTING BASED ON ACTIVITY TYPE
                $sortTimestamp = $mostRecentTicket->updated_at;
                switch ($mostRecentTicket->status) {
                    case 'assigned':
                        $sortTimestamp = $mostRecentTicket->assigned_at ?: $mostRecentTicket->updated_at;
                        break;
                    case 'closed':
                        $sortTimestamp = $mostRecentTicket->closed_at ?: $mostRecentTicket->updated_at;
                        break;
                    case 'returned':
                        $sortTimestamp = $mostRecentTicket->returned_at ?: $mostRecentTicket->updated_at;
                        break;
                    case 're-open':
                        $sortTimestamp = $mostRecentTicket->reopened_at ?: $mostRecentTicket->updated_at;
                        break;
                    case 'cancelled':
                        $sortTimestamp = $mostRecentTicket->cancelled_at ?: $mostRecentTicket->updated_at;
                        break;
                    case 'resubmitted':
                        $sortTimestamp = $mostRecentTicket->submitted_at ?: $mostRecentTicket->updated_at;
                        break;
                }

                $recentActivitiesByType[] = [
                    'type' => $activityType,
                    'title' => $activityType,
                    'description' => $description,
                    'time' => $time,
                    'icon' => $icon,
                    'status' => $mostRecentTicket->status,
                    'priority' => $priority,
                    'sort_timestamp' => $sortTimestamp
                ];
            }
        }

        // SORT BY MOST RECENT (KEEP ALL ACTIVITIES, JUST SORTED)
        usort($recentActivitiesByType, function($a, $b) {
            return strtotime($b['sort_timestamp']) - strtotime($a['sort_timestamp']);
        });

        $recentActivities = $recentActivitiesByType;

        // FORMAT SUPPORT AGENTS DATA IF USER IS A TEAM LEADER
        $supportAgents = [];
        if ($user->isTeamLeader() && $user->supportAgents) {
            $supportAgents = $user->supportAgents->map(function ($agent) {
                return [
                    'id' => $agent->id,
                    'uuid' => $agent->uuid,
                    'full_name' => $agent->name,
                    'email' => $agent->email,
                    'company' => $agent->company ? $agent->company->company_name : '',
                    'avatar_url' => $agent->avatar_url,
                    'status' => $agent->status,
                    'roles' => $agent->roles->map(function ($role) {
                        return [
                            'id' => $role->id,
                            'name' => $role->name,
                        ];
                    })->toArray(),
                    'created_at' => $agent->created_at,
                ];
            })->toArray();
        }

        // FORMAT TEAM LEADER DATA IF USER IS A SUPPORT AGENT
        $teamLeader = null;
        if ($user->isSupportAgent() && $user->teamLeaders && $user->teamLeaders->isNotEmpty()) {
            $teamLeaderData = $user->teamLeaders->first();
            $teamLeader = [
                'id' => $teamLeaderData->id,
                'uuid' => $teamLeaderData->uuid,
                'full_name' => $teamLeaderData->name,
                'email' => $teamLeaderData->email,
                'company' => $teamLeaderData->company ? $teamLeaderData->company->company_name : '',
                'avatar_url' => $teamLeaderData->avatar_url,
                'status' => $teamLeaderData->status,
                'roles' => $teamLeaderData->roles->map(function ($role) {
                    return [
                        'id' => $role->id,
                        'name' => $role->name,
                    ];
                })->toArray(),
                'created_at' => $teamLeaderData->created_at,
            ];
        }

        return [
            'id' => $user->id,
            'uuid' => $user->uuid,
            'created_at' => $user->created_at,
            'full_name' => $user->name,
            'email' => $user->email,
            'company' => $user->company ? $user->company->company_name : '',
            'avatar_url' => $user->avatar_url,
            'status' => $user->status,
            'roles' => $user->roles->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                ];
            })->toArray(),
            'user_ticket_counts' => [
                'total_tickets' => $totalTickets,
                'closed_tickets' => $closedTickets,
                'assigned_tickets' => $assignedTickets,
                'returned_tickets' => $returnedTickets,
                'cancelled_tickets' => $cancelledTickets,
                'resubmitted_tickets' => $resubmittedTickets,
                'reopen_tickets' => $reopenTickets,
            ],
            'recent_activities' => $recentActivities,
            'support_agents' => $supportAgents,
            'team_leader' => $teamLeader
        ];
    }
}

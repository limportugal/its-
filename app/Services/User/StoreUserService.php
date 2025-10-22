<?php

namespace App\Services\User;

use App\Models\User;
use App\Models\UserLogs;
use App\Models\TeamLeaderAssignment;
use App\Notifications\UserCreatePasswordNotification;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB;

class StoreUserService
{
    public function __construct(
        protected User $user,
        protected UserLogs $userLogs
    ) {}

    public function create($request): array
    {
        return DB::transaction(function () use ($request) {
            // SET DEFAULT STATUS TO 'AWAITING_PASSWORD' IF NOT PROVIDED
            if (!$request->has('status') || empty($request->status)) {
                $request->merge(['status' => 'awaiting_password']);
            }

            // CREATE THE USER USING VALIDATED DATA
            $user = $this->user->createUser($request->validated());

            // SEND EMAIL NOTIFICATION IF EMAIL EXISTS
            if (!empty($user->email)) {
                $user->notify(new UserCreatePasswordNotification());
            }

            // HANDLE ROLE ASSIGNMENT
            $assignedRoles = [];
            if ($request->has('roles') && is_array($request->roles)) {
                $roleIds = collect($request->roles)->pluck('id')->all();
                $roleModels = Role::whereIn('id', $roleIds)->get();
                
                if ($roleModels->isNotEmpty()) {
                    $user->syncRoles($roleModels);
                    $assignedRoles = $roleModels->pluck('name')->all();
                }
            }

            // HANDLE TEAM LEADER ASSIGNMENT
            if ($request->has('team_leader_id') && !empty($request->team_leader_id)) {
                $this->assignTeamLeader($user->id, $request->team_leader_id);
            }

            // LOG ACTIVITY
            $roleNames = !empty($assignedRoles) ? implode(', ', $assignedRoles) : 'No roles assigned';
            $this->userLogs->logActivity("User name ({$user->name}) created successfully with roles: {$roleNames}.");

            // GET USER WITH ROLES AND TEAM LEADER
            $userWithRoles = $user->load(['roles', 'teamLeaders:id,name']);
            
            // FORMAT THE RESPONSE DATA
            $responseData = [
                'name' => $userWithRoles->name,
                'email' => $userWithRoles->email,
                'company_id' => $userWithRoles->company_id,
                'uuid' => $userWithRoles->uuid,
                'created_at' => $userWithRoles->created_at,
                'id' => $userWithRoles->id,
                'roles' => $userWithRoles->roles->map(function ($role) {
                    return [
                        'id' => $role->id,
                        'name' => $role->name,
                    ];
                })->toArray(),
                'team_leader' => $userWithRoles->teamLeaders->first() ? [
                    'id' => $userWithRoles->teamLeaders->first()->id,
                    'name' => $userWithRoles->teamLeaders->first()->name,
                    'email' => $userWithRoles->teamLeaders->first()->email,
                    'avatar_url' => $userWithRoles->teamLeaders->first()->avatar_url,
                ] : null
            ];

            return [
                'success' => true,
                'message' => 'User created successfully',
                'data' => $responseData
            ];
        });
    }

    // ASSIGN A TEAM LEADER TO A SUPPORT AGENT
    private function assignTeamLeader($supportAgentId, $teamLeaderId): void
    {
        // VALIDATE THAT TEAM LEADER EXISTS AND HAS THE CORRECT ROLE
        $teamLeader = User::where('id', $teamLeaderId)->firstOrFail();
        if (!$teamLeader->isTeamLeader()) {
            return;
        }

        // VALIDATE THAT SUPPORT AGENT EXISTS AND HAS THE CORRECT ROLE
        $supportAgent = User::where('id', $supportAgentId)->firstOrFail();
        if (!$supportAgent->isSupportAgent()) {
            return;
        }

        // CHECK IF SUPPORT AGENT ALREADY HAS A TEAM LEADER
        $existingAssignment = TeamLeaderAssignment::where('support_agent_id', $supportAgentId)->first();
        if ($existingAssignment) {
            return;
        }

        // CREATE THE ASSIGNMENT
        TeamLeaderAssignment::create([
            'team_leader_id' => $teamLeaderId,
            'support_agent_id' => $supportAgentId,
        ]);
    }
}

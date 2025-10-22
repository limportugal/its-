<?php

namespace App\Services\User;

use App\Models\User;
use App\Models\Company;
use App\Models\UserLogs;
use App\Models\TeamLeaderAssignment;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class UpdateUserService
{
    use AuthorizesRequests;

    public function __construct(
        protected User $user,
        protected UserLogs $userLogs
    ) {}

    public function update($request, $uuid): array
    {
        return DB::transaction(function () use ($request, $uuid) {
            // CHECK IF THE PARAMETER IS NUMERIC (ID) OR A UUID STRING
            if (is_numeric($uuid)) {
                $user = User::findOrFail($uuid);
            } else {
                $user = User::where('uuid', $uuid)->firstOrFail();
            }

            // AUTHORIZATION CHECK
            $this->authorize('update', $user);

            $originalData = $user->only($user->getFillable());
            $dataToUpdate = $request->validated();
            $rolesChanged = false;
            $roleDescriptions = [];

            // CHECK IF ROLES ARE CHANGED
            if ($request->has('roles')) {
                $roleNames = collect($request->roles)->pluck('name')->all();

                // GET ROLES FROM DATABASE
                $roles = Role::whereIn('name', $roleNames)->where('guard_name', 'web')->get();

                if ($roles->count() !== count($roleNames)) {
                    return [
                        'success' => false,
                        'message' => 'Some roles were not found.'
                    ];
                }

                $originalRoleNames = $user->roles->pluck('name')->all();
                if ($originalRoleNames !== $roleNames) {
                    $rolesChanged = true;
                    $user->syncRoles($roles);
                    $roleDescriptions[] = "Roles changed from '" . implode(', ', $originalRoleNames) . "' to '" . implode(', ', $roleNames) . "'";
                }
            }

            // CHECK IF THERE ARE CHANGES IN OTHER FIELDS
            $changes = [];
            foreach ($dataToUpdate as $field => $newValue) {
                // SKIP ROLES FIELD AS IT'S HANDLED SEPARATELY
                if ($field == 'roles') {
                    continue;
                }
                
                if ($field == 'company_id') {
                    $originalCompanyName = $user->company ? $user->company->company_name : 'null';
                    $newCompanyName = Company::find($newValue) ? Company::find($newValue)->company_name : 'null';

                    if ($originalCompanyName != $newCompanyName) {
                        $changes['company_name'] = [
                            'from' => $originalCompanyName,
                            'to' => $newCompanyName
                        ];
                    }
                } else {
                    if (isset($originalData[$field]) && $newValue != $originalData[$field]) {
                        $changes[$field] = [
                            'from' => $originalData[$field] ?? 'null',
                            'to' => $newValue ?? 'null',
                        ];
                    }
                }
            }

            // HANDLE TEAM LEADER ASSIGNMENT
            $teamLeaderChanged = false;
            if ($request->has('team_leader_id')) {
                $newTeamLeaderId = $request->team_leader_id;
                $currentTeamLeaderId = $user->teamLeaders->first()?->id;
                
                if ($newTeamLeaderId != $currentTeamLeaderId) {
                    $this->updateTeamLeaderAssignment($user->id, $newTeamLeaderId);
                    $teamLeaderChanged = true;
                }
            }

            // UPDATE RECORD IF THERE ARE CHANGES
            if (!empty($changes) || $rolesChanged || $teamLeaderChanged) {
                // REMOVE ROLES AND TEAM_LEADER_ID FROM DATA TO UPDATE SINCE THEY'RE NOT FILLABLE FIELDS
                $updateData = $dataToUpdate;
                unset($updateData['roles']);
                unset($updateData['team_leader_id']);
                
                $user->update($updateData);

                $changeDescriptions = array_map(function ($change) {
                    return "from {$change['from']} to {$change['to']}";
                }, $changes, array_keys($changes));

                if ($rolesChanged) {
                    $changeDescriptions[] = implode('; ', $roleDescriptions);
                }

                if ($teamLeaderChanged) {
                    $changeDescriptions[] = "Team leader assignment updated";
                }

                $this->userLogs->logActivity("User details updated: " . implode(', ', $changeDescriptions) . ".");
            }

            // Get fresh user data with roles and team leader
            $freshUser = $user->fresh()->load(['roles', 'teamLeaders']);
            
            // Format the response data
            $responseData = [
                'id' => $freshUser->id,
                'uuid' => $freshUser->uuid,
                'name' => $freshUser->name,
                'email' => $freshUser->email,
                'company_id' => $freshUser->company_id,
                'status' => $freshUser->status,
                'created_at' => $freshUser->created_at,
                'roles' => $freshUser->roles->map(function ($role) {
                    return [
                        'id' => $role->id,
                        'name' => $role->name,
                    ];
                })->toArray(),
                'team_leader' => $freshUser->teamLeaders->first() ? [
                    'id' => $freshUser->teamLeaders->first()->id,
                    'name' => $freshUser->teamLeaders->first()->name,
                    'email' => $freshUser->teamLeaders->first()->email,
                    'avatar_url' => $freshUser->teamLeaders->first()->avatar_url,
                ] : null
            ];

            return [
                'success' => true,
                'message' => 'User updated successfully!',
                'data' => $responseData
            ];
        });
    }

    // UPDATE TEAM LEADER ASSIGNMENT FOR A SUPPORT AGENT
    private function updateTeamLeaderAssignment($supportAgentId, $teamLeaderId): void
    {
        // IF TEAM_LEADER_ID IS NULL, REMOVE EXISTING ASSIGNMENT
        if (is_null($teamLeaderId)) {
            $existingAssignment = TeamLeaderAssignment::where('support_agent_id', $supportAgentId)->first();
            if ($existingAssignment) {
                $existingAssignment->delete();
            }
            return;
        }

        // VALIDATE THAT TEAM LEADER EXISTS AND HAS THE CORRECT ROLE
        $teamLeader = User::where('id', $teamLeaderId)->firstOrFail();
        if (!$teamLeader->hasRole('Team Leader')) {
            return;
        }

        // VALIDATE THAT SUPPORT AGENT EXISTS AND HAS THE CORRECT ROLE
        $supportAgent = User::where('id', $supportAgentId)->firstOrFail();
        if (!$supportAgent->hasRole('Support Agent')) {
            return;
        }

        // CHECK IF SUPPORT AGENT ALREADY HAS A TEAM LEADER
        $existingAssignment = TeamLeaderAssignment::where('support_agent_id', $supportAgentId)->first();
        
        if ($existingAssignment) {
            // UPDATE EXISTING ASSIGNMENT
            $existingAssignment->update(['team_leader_id' => $teamLeaderId]);
        } else {
            // CREATE NEW ASSIGNMENT
            TeamLeaderAssignment::create([
                'team_leader_id' => $teamLeaderId,
                'support_agent_id' => $supportAgentId,
            ]);
        }
    }
}

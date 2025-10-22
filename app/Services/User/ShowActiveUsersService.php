<?php

namespace App\Services\User;

use App\Models\User;
use App\Traits\HidesUserRolePivot;

class ShowActiveUsersService
{
    use HidesUserRolePivot;

    public function getActiveUsers()
    {
        $users = User::select(
            'id',
            'uuid',
            'name',
            'email',
            'company_id',
            'status',
            'created_at',
        )
        ->with([
            'company:id,company_name', 
            'roles:id,name',
        ])
            ->whereIn('status', ['active', 'awaiting_password'])
            ->orderBy('created_at', 'DESC')
            ->orderBy('updated_at', 'DESC')
            ->get()
            ->makeHidden(['company_id', 'password', 'remember_token', 'statusDisplay']);

        // LOAD TEAM LEADER RELATIONSHIP ONLY FOR SUPPORT AGENTS
        $supportAgentIds = $users->filter(function ($user) {
            return $user->roles->contains('name', 'Support Agent');
        })->pluck('id');

        if ($supportAgentIds->isNotEmpty()) {
            $supportAgentsWithTeamLeaders = User::whereIn('users.id', $supportAgentIds)
                ->with(['teamLeaders'])
                ->get()
                ->keyBy('id');

            // MERGE TEAM LEADER DATA FOR SUPPORT AGENTS ONLY
            $users->each(function ($user) use ($supportAgentsWithTeamLeaders) {
                $isSupportAgent = $user->roles->contains('name', 'Support Agent');
                if ($isSupportAgent && $supportAgentsWithTeamLeaders->has($user->id)) {
                    $teamLeader = $supportAgentsWithTeamLeaders[$user->id]->teamLeaders->first();
                    if ($teamLeader) {
                        // CLEAN UP TEAM LEADER DATA - HIDE UNNECESSARY FIELDS
                        $teamLeader->makeHidden([
                            'company_id', 
                            'status', 
                            'email_verified_at', 
                            'created_at', 
                            'updated_at', 
                            'laravel_through_key',
                            'password',
                            'remember_token',
                            'pivot'
                        ]);
                    }
                    $user->setRelation('teamLeader', $teamLeader);
                }
            });
        }

        // REMOVE TEAM LEADER FIELD FROM NON-SUPPORT AGENTS
        $users->each(function ($user) {
            $isSupportAgent = $user->roles->contains('name', 'Support Agent');
            if (!$isSupportAgent) {
                $user->offsetUnset('team_leader');
            }
        });

        $this->hideUserRolePivots($users, ['roles']);
        return $users;
    }
}

<?php

namespace App\Services\User;

use App\Models\User;
use App\Models\UserLogs;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ActivateUserService
{
    use AuthorizesRequests;

    public function __construct(
        protected User $user,
        protected UserLogs $userLogs
    ) {}

    public function activateUser($uuid): array
    {
        return DB::transaction(function () use ($uuid) {
            $user = $this->user->where('uuid', $uuid)->firstOrFail();

            $this->authorize('activate', $user);

            // UPDATE USER STATUS
            $user->update([
                'status' => 'active',
                'activated_by_id' => Auth::user()->id,
            ]);

            // LOG ACTIVITY
            $this->userLogs->logActivity("User name: " . $user->name . " has been activated");

            return [
                'success' => true,
                'message' => 'User activated successfully'
            ];
        });
    }
}

<?php

namespace App\Services\User;

use App\Models\User;
use App\Models\UserLogs;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class DeleteUserService
{
    use AuthorizesRequests;

    public function __construct(
        protected User $user,
        protected UserLogs $userLogs
    ) {}

    public function deleteUser($uuid): array
    {
        return DB::transaction(function () use ($uuid) {
            $user = $this->user->where('uuid', $uuid)->firstOrFail();

            // AUTHORIZE THE USER
            $this->authorize('delete', $user);

            // UPDATE USER STATUS
            $user->update([
                'status' => 'deleted',
                'deleted_by_id' => Auth::user()->id,
            ]);

            // LOG ACTIVITY
            $this->userLogs->logActivity("User name: " . $user->name . " has been deleted");

            return [
                'success' => true,
                'message' => 'User deleted successfully'
            ];
        });
    }
}

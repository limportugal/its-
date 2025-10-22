<?php

namespace App\Services\User;

use App\Models\User;
use App\Models\UserLogs;
use App\Jobs\SendUserDeactivatedEmail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class DeactivateUserService
{
    use AuthorizesRequests;

    public function __construct(
        protected User $user,
        protected UserLogs $userLogs
    ) {}

    public function deactivateUser($uuid): array
    {
        return DB::transaction(function () use ($uuid) {
            $user = $this->user->where('uuid', $uuid)->firstOrFail();

            // AUTHORIZE THE USER
            $this->authorize('deactivate', $user);

            // SEND EMAIL NOTIFICATION
            if ($user->email) {
                try {
                    SendUserDeactivatedEmail::dispatch($user, null, Auth::user());
                } catch (\Exception $e) {
                    // Continue with deactivation even if email fails
                }
            }

            // UPDATE USER STATUS
            $user->update([
                'status' => 'inactive',
                'deactivated_by_id' => Auth::user()->id,
            ]);

            // LOG ACTIVITY
            $this->userLogs->logActivity("User name: " . $user->name . " has been deactivated");

            // CHECK IF USER DEACTIVATED THEIR OWN ACCOUNT
            $isSelfDeactivation = Auth::id() == $user->id;

            return [
                'success' => true,
                'message' => $isSelfDeactivation 
                    ? 'Your account has been deactivated successfully. You will be logged out.'
                    : 'User deactivated successfully',
                'self_deactivated' => $isSelfDeactivation
            ];
        });
    }
}

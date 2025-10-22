<?php

namespace App\Services\User\Profile;

use App\Models\User;
use App\Models\UserLogs;
use Illuminate\Support\Facades\Hash;

class StoreNewPasswordService
{
    public function storeNewPassword(User $user, array $data): void
    {
        $user->refresh();

        // CHECK IF USER EXISTS AND IS ACTIVE
        if (!$user->exists) {
            throw new \Exception('User not found');
        }

        if ($user->status !== 'active' && $user->status !== 'awaiting_password') {
            throw new \Exception('User account is not active');
        }

        // CHECK IF PASSWORD IS ALREADY SET
        if (!empty($user->password)) {
            throw new \Exception('Password already set');
        }

        // UPDATE PASSWORD AND STATUS
        $user->update([
            'password' => Hash::make($data['password']),
            'status' => 'active',
        ]);

        // LOG ACTIVITY
        $companyName = $user->company->company_name ?? 'No Company';
        $roleName = $user->roles->first()?->name ?? 'No Role';
        UserLogs::logActivity("{$user->name}, has successfully created password. ({$companyName} | {$roleName})", $user->id);
    }
}

<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\UserLogs;
use App\Http\Requests\Auth\StoreNewPasswordRequest;
use App\Http\Requests\Auth\UpdatePasswordRequest;
use App\Services\User\Profile\StoreNewPasswordService;
use Inertia\Inertia;

class PasswordController extends Controller
{
    // SHOW CREATE PASSWORD FORM
    public function showCreateForm(User $user)
    {
        return Inertia::render('Auth/CreatePassword', [
            'user' => [
                'id' => $user->id,
                'uuid' => $user->uuid,
                'name' => $user->name,
            ],
        ]);
    }

    // STORE NEW PASSWORD
    public function storeNewPassword(StoreNewPasswordRequest $request, User $user)
    {
        (new StoreNewPasswordService())->storeNewPassword($user, $request->validated());
        return back();
    }

    // UPDATE PASSWORD
    public function update(UpdatePasswordRequest $request)
    {
        $validated = $request->validated();
        $user = $request->user();

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        // LOG ACTIVITY
        $companyName = $user->company->company_name ?? 'No Company';
        $roleName = $user->roles->first()?->name ?? 'No Role';
        UserLogs::logActivity("{$user->name}, has successfully updated password. ({$companyName} | {$roleName})", $user->id);

        return response()->json([
            'success' => true,
            'message' => 'Password updated successfully',
            'data' => null
        ]);
    }
}

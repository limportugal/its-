<?php

namespace App\Services\User;

use App\Models\User;

class GetUsersImageService
{
    public function __construct(
        protected User $user
    ) {}

    public function getUsersImage(): array
    {
        $users = $this->user->select('id', 'name')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'avatar_url' => $user->avatar_url,
                ];
            })
            ->all();

        return $users;
    }
}

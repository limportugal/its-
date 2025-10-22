<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;

if (! function_exists('user')) {
    function user(): ?User
    {
        $user = Auth::user();

        return $user instanceof User ? $user : null;
    }
}

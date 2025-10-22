<?php

namespace App\Http\Controllers\RBAC;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class RoleAndPermissionController extends Controller
{
    public function index()
    {
        return Inertia::render('RoleAndPermission/RoleAndPermission');
    }
}

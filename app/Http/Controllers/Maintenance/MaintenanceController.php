<?php

namespace App\Http\Controllers\Maintenance;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class MaintenanceController extends Controller
{
    public function index()
    {
        return Inertia::render('Maintenance/MaintenanceNavTabs');
    }
}

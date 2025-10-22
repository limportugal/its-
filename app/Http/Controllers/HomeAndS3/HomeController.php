<?php

namespace App\Http\Controllers\HomeAndS3;

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Controller;

class HomeController extends Controller
{
    public function home()
    {
        return Inertia::render('Welcome', [
            'canLogin'    => Route::has('login'),
        ]);
    }
}

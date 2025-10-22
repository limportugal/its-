<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\Dashboard\TicketSummarService;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    protected $ticketSummaryService;

    public function __construct(TicketSummarService $ticketSummaryService)
    {
        $this->ticketSummaryService = $ticketSummaryService;
    }

    public function index()
    {
        return Inertia::render('Dashboard/ViewDashboard');
    }

    public function showTicketSummary()
    {
        $ticketSummary = $this->ticketSummaryService->getTicketSummary();
        return response()->json($ticketSummary);
    }
}

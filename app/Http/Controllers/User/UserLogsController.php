<?php

namespace App\Http\Controllers\User;

use Inertia\Inertia;
use App\Http\Controllers\Controller;

// SERVICES
use App\Services\Userlogs\ShowUserlogsService;
use App\Services\Userlogs\GetUserLogsByTicketNumberService;

class UserLogsController extends Controller
{

    protected ShowUserlogsService $showUserlogsService;
    protected GetUserLogsByTicketNumberService $getUserLogsByTicketNumberService;

    public function __construct(
        ShowUserlogsService $showUserlogsService,
        GetUserLogsByTicketNumberService $getUserLogsByTicketNumberService
    ) {
        $this->showUserlogsService = $showUserlogsService;
        $this->getUserLogsByTicketNumberService = $getUserLogsByTicketNumberService;
    }

    public function index()
    {
        return Inertia::render('UserLogs/IndexUserLogs');
    }

    public function show()
    {
        $userLogs = $this->showUserlogsService->getAllUserLogs();
        return response()->json($userLogs);
    }

    public function getUserLogsByTicketNumber(string $ticketNumber)
    {
        $userLogsTicketNumberById = $this->getUserLogsByTicketNumberService->getUserLogsByTicketNumber($ticketNumber);
        return response()->json($userLogsTicketNumberById);
    }
}

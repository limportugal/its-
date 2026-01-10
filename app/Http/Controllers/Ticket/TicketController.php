<?php

namespace App\Http\Controllers\Ticket;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\Ticket;
use Illuminate\Http\Request;

// VALIDATION REQUEST
use App\Http\Requests\Ticket\UpdateTicketRequest;

// SERVICES
use App\Services\Ticket\StoreTicketService;
use App\Services\Ticket\PendingTicketsService;
use App\Services\Ticket\UpdateTicketService;
use App\Services\Ticket\ViewPendingTicketNumberService;
use App\Services\Ticket\ClosedTicketsService;
use App\Services\Ticket\DeleteTicketService;
use App\Services\Ticket\ReturnTicketService;
use App\Services\Ticket\ViewClosedTicketNumberService;
use App\Services\Ticket\AssignToUserTicketService;
use App\Services\Ticket\ResubmitTicketService;
use App\Services\Ticket\CancelTicketService;
use App\Services\Ticket\CancelledTicketsService;
use App\Services\Ticket\ViewCancelledTicketService;
use App\Services\Ticket\ReOpenTicketService;
use App\Services\Ticket\ViewResubmitTicketService;
use App\Services\Ticket\RemindClientTicket;
use App\Services\Ticket\FollowUpTicketByClientService;
use App\Services\Ticket\DeletedTicketsService;
use App\Services\Ticket\ViewDeletedTicketNumberService;
use App\Services\Ticket\RestoreTicketService;
use App\Services\Ticket\AssignTicketToAgentDropdownService;

class TicketController extends Controller
{
    use AuthorizesRequests;
    
    protected StoreTicketService $ticketService;
    protected PendingTicketsService $pendingTicketsService;
    protected UpdateTicketService $updateTicketService;
    protected ViewPendingTicketNumberService $viewPendingTicketNumberService;
    protected ClosedTicketsService $closedTicketsService;
    protected DeleteTicketService $deleteTicketService;
    protected ReturnTicketService $returnTicketService;
    protected ViewClosedTicketNumberService $ViewClosedTicketNumberService;
    protected AssignToUserTicketService $assignToUserTicketService;
    protected ResubmitTicketService $resubmitTicketService;
    protected CancelTicketService $cancelTicketService;
    protected CancelledTicketsService $cancelledTicketsService;
    protected ViewCancelledTicketService $ViewCancelledTicketService;
    protected ReOpenTicketService $reOpenTicketService;
    protected ViewResubmitTicketService $viewResubmitTicketService;
    protected RemindClientTicket $remindClientTicket;
    protected FollowUpTicketByClientService $followUpTicketByClientService;
    protected DeletedTicketsService $deletedTicketsService;
    protected ViewDeletedTicketNumberService $viewDeletedTicketNumberService;
    protected RestoreTicketService $restoreTicketService;
    protected AssignTicketToAgentDropdownService $assignTicketToAgentDropdownService;

    public function __construct(
        StoreTicketService $ticketService, 
        PendingTicketsService $pendingTicketsService,
        UpdateTicketService $updateTicketService,
        ViewPendingTicketNumberService $viewPendingTicketNumberService,
        ClosedTicketsService $closedTicketsService,
        DeleteTicketService $deleteTicketService,
        ReturnTicketService $returnTicketService,
        ViewClosedTicketNumberService $ViewClosedTicketNumberService,
        AssignToUserTicketService $assignToUserTicketService,
        ResubmitTicketService $resubmitTicketService,
        CancelTicketService $cancelTicketService,
        CancelledTicketsService $cancelledTicketsService,
        ViewCancelledTicketService $ViewCancelledTicketService,
        ReOpenTicketService $reOpenTicketService,
        ViewResubmitTicketService $viewResubmitTicketService,
        RemindClientTicket $remindClientTicket,
        FollowUpTicketByClientService $followUpTicketByClientService,
        DeletedTicketsService $deletedTicketsService,
        ViewDeletedTicketNumberService $viewDeletedTicketNumberService,
        RestoreTicketService $restoreTicketService,
        AssignTicketToAgentDropdownService $assignTicketToAgentDropdownService
        )
    {
        $this->ticketService = $ticketService;
        $this->pendingTicketsService = $pendingTicketsService;
        $this->updateTicketService = $updateTicketService;
        $this->viewPendingTicketNumberService = $viewPendingTicketNumberService;
        $this->closedTicketsService = $closedTicketsService;
        $this->deleteTicketService = $deleteTicketService;
        $this->returnTicketService = $returnTicketService;
        $this->ViewClosedTicketNumberService = $ViewClosedTicketNumberService;
        $this->assignToUserTicketService = $assignToUserTicketService;
        $this->resubmitTicketService = $resubmitTicketService;
        $this->cancelTicketService = $cancelTicketService;
        $this->cancelledTicketsService = $cancelledTicketsService;
        $this->ViewCancelledTicketService = $ViewCancelledTicketService;
        $this->reOpenTicketService = $reOpenTicketService;
        $this->viewResubmitTicketService = $viewResubmitTicketService;
        $this->remindClientTicket = $remindClientTicket;
        $this->followUpTicketByClientService = $followUpTicketByClientService;
        $this->deletedTicketsService = $deletedTicketsService;
        $this->viewDeletedTicketNumberService = $viewDeletedTicketNumberService;
        $this->restoreTicketService = $restoreTicketService;
        $this->assignTicketToAgentDropdownService = $assignTicketToAgentDropdownService;
    }

    public function indexPendingTickets()
    {
        return Inertia::render('Tickets/Indexes/IndexPendingTickets');
    }

    public function getViewPendingTicketData($uuid)
    {
        $data = $this->viewPendingTicketNumberService->getViewPendingTicketData($uuid);
        return response()->json($data);
    }

    public function viewPendingTicketByUuid($uuid)
    {
        $this->viewPendingTicketNumberService->getViewPendingTicketData($uuid);
        return Inertia::render('Tickets/Views/PendingTicket/ViewPendingTicket', [
            'uuid' => $uuid,
        ]);
    }

    public function showPendingTickets()
    {
        $pendingTickets = $this->pendingTicketsService->getPendingTickets();
        return response()->json($pendingTickets);
    }

    public function update(UpdateTicketRequest $request, $uuid)
    {
        $responseData = $this->updateTicketService->updateTicket($request, $uuid);
        return response()->json($responseData, 200);
    }

    public function indexClosedTickets()
    {
        return Inertia('Tickets/Indexes/IndexClosedTickets');
    }

    public function showClosedTickets()
    {
        $closedTickets = $this->closedTicketsService->getClosedTickets();
        return response()->json($closedTickets);
    }

    public function viewClosedTicketByUuid($uuid)
    {
        return Inertia::render('Tickets/Views/ClosedTicket/ViewClosedTicket', ['uuid' => $uuid]);
    }

    public function showClosedTicketByUuid($uuid)
    {
        $ticket = $this->ViewClosedTicketNumberService->getClosedTicketByUuid($uuid);
        return response()->json($ticket);
    }

    public function deleteTicket($uuid)
    {
        $deletedTicket = $this->deleteTicketService->deleteTicket($uuid);
        return response()->json($deletedTicket, 200);
    }

    public function returnTicket(Request $request, $ticket_uuid)
    {
        return $this->returnTicketService->returnTicket($request, $ticket_uuid);
    }

    public function assignTicketToUser(Request $request, $ticket_uuid)
    {
        $request->validate([
            'user_uuid' => 'required|array|min:1',
            'user_uuid.*' => 'required|string|exists:users,uuid',
            'priority_id' => 'nullable|string',
        ]);

        $result = $this->assignToUserTicketService->assignTicketToUser(
            $ticket_uuid,
            $request->user_uuid
        );
        return response()->json($result, 200);
    }

    public function showResubmitPage($uuid)
    {
        $ticketData = $this->viewResubmitTicketService->getTicketDataForResubmit($uuid);
        $ticket = Ticket::select('ticket_number', 'status')
        ->whereIn('status', ['returned', 'resubmitted', 'reminder'])
        ->where('uuid', $uuid)
        ->firstOrFail();
        return Inertia::render('Tickets/Views/ViewResubmittedTickets', [
            'ticket_uuid' => $uuid,
            'ticket_data' => $ticketData,
            'ticket' => $ticket
        ]);
    }

    public function showFollowUpPage($uuid)
    {
        $ticket = Ticket::select('ticket_number', 'status')
        ->whereIn('status', ['assigned', 'follow-up'])
        ->where('uuid', $uuid)
        ->firstOrFail();

        return Inertia::render('Tickets/Views/FollowUpTicketByClient', [
            'ticket_uuid' => $uuid,
            'ticket_data' => $ticket
        ]);
    }

    public function followUpTicketByClient(Request $request, $uuid)
    {
        return $this->followUpTicketByClientService->followUpTicketByClient($request, $uuid);
    }

    public function resubmitTicket(Request $request, $uuid)
    {
        return $this->resubmitTicketService->resubmitTicket($request, $uuid);
    }

    public function cancelTicket(Request $request, $uuid)
    {
        $cancelTicket = $this->cancelTicketService->cancelTicket($request, $uuid);
        return response()->json($cancelTicket, 200);
    }

    public function remindClient(Request $request, $uuid)
    {
        $remindTicket = $this->remindClientTicket->remindClient($request, $uuid);
        return response()->json($remindTicket, 200);
    }

    public function indexCancelledTickets()
    {
        return Inertia::render('Tickets/Indexes/IndexCancelledTickets');
    }

    public function showCancelledTickets()
    {
        $cancelledTickets = $this->cancelledTicketsService->getCancelledTickets();
        return $cancelledTickets;
    }

    public function viewCancelledTicketByUuid($uuid)
    {
        return Inertia::render('Tickets/Views/CancelledTicket/ViewCancelledTicket', ['uuid' => $uuid]);
    }

    public function indexDeletedTickets()
    {
        return Inertia::render('Tickets/Indexes/IndexDeletedTickets');
    }

    public function showDeletedTickets()
    {
        $deletedTickets = $this->deletedTicketsService->getDeletedTickets();
        return response()->json($deletedTickets);
    }

    public function viewDeletedTicketByUuid($uuid)
    {
        $this->viewDeletedTicketNumberService->getViewDeletedTicketData($uuid);
        return Inertia::render('Tickets/Views/DeletedTicket/ViewDeletedTicket', ['uuid' => $uuid]);
    }

    public function getViewDeletedTicketData($uuid)
    {
        $ticket = $this->viewDeletedTicketNumberService->getViewDeletedTicketData($uuid);
        return response()->json($ticket);
    }

    public function showCancelledTicketByUuid($uuid)
    {
        $ticket = $this->ViewCancelledTicketService->getCancelledTicketByUuid($uuid);
        return response()->json($ticket);
    }

    public function reopenTicketByUuid(Request $request, $uuid)
    {
        return $this->reOpenTicketService->reOpenTicket($request, $uuid);
    }

    public function restoreTicketByUuid($uuid)
    {
        return $this->restoreTicketService->restoreTicket($uuid);
    }

    public function getUsersDropdown()
    {
        $users = $this->assignTicketToAgentDropdownService->assignTicketToAgentDropdown();
        return response()->json([
            'data' => $users
        ]);
    }
}

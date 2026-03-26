<?php

namespace App\Http\Controllers\Ticket;

use App\Http\Controllers\Controller;

// MODELS
use App\Models\Priority;
use App\Models\Category;
use App\Models\ServiceCenter;
use App\Models\System;
use App\Models\Ownership;
use App\Models\StoreType;

// SERVICES
use App\Services\Ticket\StoreTicketService;

// VALIDATION REQUEST
use App\Http\Requests\Ticket\StoreTicketRequest;

class CreateTicketController extends Controller
{
    protected StoreTicketService $ticketService;

    public function __construct(
        StoreTicketService $ticketService,
    ) {
        $this->ticketService = $ticketService;
    }

    public function createTicket(StoreTicketRequest $request)
    {
        try {
            $ticketData = $request->validated();
            $responseData = $this->ticketService->createTicket($ticketData, $request);
            return response()->json($responseData, 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create ticket. Please try again.',
                'errors' => [
                    'general' => ['An unexpected error occurred while creating the ticket.'],
                ],
            ], 500);
        }
    }

    public function showTicketPriorities()
    {
        $showPriorities = Priority::select('id', 'priority_name')->where('status', 'active')->get();
        return response()->json($showPriorities);
    }

    public function serviceCenterDropdown()
    {
        $serviceCenters = ServiceCenter::select('id', 'service_center_name')->where('status', 'active')->get();
        return response()->json($serviceCenters);
    }

    public function systemDropdown()
    {
        $systems = System::select('id', 'system_name')
            ->where('status', 'active')
            ->orderByRaw("CASE WHEN system_name = 'Customer Not Found' THEN 0 ELSE 1 END")
            ->orderBy('system_name', 'asc')
            ->get();
        return response()->json($systems);
    }

    public function ownershipDropdown()
    {
        $ownerships = Ownership::select('id', 'ownership_name')
            ->where('status', 'active')
            ->orderBy('ownership_name', 'asc')
            ->get();

        return response()->json($ownerships);
    }

    public function storeTypeDropdown()
    {
        $storeTypes = StoreType::select('id', 'store_type_name')
            ->where('status', 'active')
            ->orderBy('store_type_name', 'asc')
            ->get();

        return response()->json($storeTypes);
    }

    public function showTicketCategoriesBySystem($systemId)
    {
        $categories = Category::select('id', 'category_name')
            ->where('status', 'active')
            ->where('system_id', $systemId)
            ->get();
        return response()->json($categories);
    }
}
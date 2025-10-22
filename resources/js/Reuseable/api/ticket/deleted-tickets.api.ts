import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { DeletedTicketResponse } from "@/Reuseable/types/ticket/deleted-tickets.types";

const deletedTicketsApiClient = axios.create({
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

export const fetchDeletedTicketsData = async (): Promise<DeletedTicketResponse> => {
    const url = route('tickets.showDeletedTickets');
    const response = await apiRequest<DeletedTicketResponse>(
        deletedTicketsApiClient,
        "get",
        url,
    );
    return response;
};

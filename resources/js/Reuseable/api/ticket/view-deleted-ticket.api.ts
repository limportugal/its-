import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { ViewDeletedTicketResponse } from "@/Reuseable/types/ticket/view-deleted-ticket.types";

const viewDeletedTicketApiClient = axios.create({
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

export const fetchViewDeletedTicketData = async (uuid: string): Promise<ViewDeletedTicketResponse> => {
    const url = route('tickets.getViewDeletedTicketData', { uuid });
    const response = await apiRequest<ViewDeletedTicketResponse>(
        viewDeletedTicketApiClient,
        "get",
        url,
    );
    return response;
};

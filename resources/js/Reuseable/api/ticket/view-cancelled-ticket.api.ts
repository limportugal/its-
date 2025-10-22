import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { ViewPendingTicketResponse } from "@/Reuseable/types/ticket/view-pending-ticket.types";

const viewCancelledTicketApiClient = axios.create({
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

export const fetchViewCancelledTicketData = async (uuid: string): Promise<ViewPendingTicketResponse> => {
    const url = route('tickets.showCancelledTicketByUuid', { uuid });
    const response = await apiRequest<ViewPendingTicketResponse>(
        viewCancelledTicketApiClient,
        "get",
        url,
    );
    return response;
};

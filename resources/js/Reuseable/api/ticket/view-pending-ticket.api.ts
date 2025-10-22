import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { ViewPendingTicketResponse } from "@/Reuseable/types/ticket/view-pending-ticket.types";

const viewPendingTicketApiClient = axios.create({
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

export const fetchViewPendingTicketData = async (uuid: string): Promise<ViewPendingTicketResponse> => {
    const url = route('tickets.getViewPendingTicketData', { uuid });
    const response = await apiRequest<ViewPendingTicketResponse>(
        viewPendingTicketApiClient,
        "get",
        url,
    );
    return response;
};

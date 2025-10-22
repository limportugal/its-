import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { ViewPendingTicketResponse } from "@/Reuseable/types/ticket/view-pending-ticket.types";

const viewClosedTicketApiClient = axios.create({
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

export const fetchViewClosedTicketData = async (uuid: string): Promise<ViewPendingTicketResponse> => {
    const url = route('tickets.showClosedTicketByUuid', { uuid });
    const response = await apiRequest<ViewPendingTicketResponse>(
        viewClosedTicketApiClient,
        "get",
        url,
    );
    return response;
};

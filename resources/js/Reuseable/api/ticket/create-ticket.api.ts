import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";

const createTicketApiClient = axios.create({
    withCredentials: true,
});

export const createTicketData = async (createData: FormData): Promise<{ ticket: { ticket_number: string } }> => {
    const url = route('public.tickets.create');
    const response = await apiRequest<{ ticket: { ticket_number: string } }>(
        createTicketApiClient,
        "post",
        url,
        createData
    );
    return response;
};
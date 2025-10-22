import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";

// AXIOS INSTANCE FOR THE TICKETS MODULE
const returnTicketApiClient = axios.create({
    withCredentials: true,
});

export const returnTicketData = async (uuid: string, returnReason: string, attachment?: File | null) => {
    const url = route('tickets.returnTicketByUuid', { ticket_uuid: uuid });
    
    // CREATE FORMDATA FOR FILE UPLOAD
    const formData = new FormData();
    formData.append('return_reason', returnReason);
    
    if (attachment && attachment instanceof File) {
        formData.append('attachment', attachment);
    }
    
    const response = await apiRequest(
        returnTicketApiClient,
        "post",
        url,
        formData
    );
    return response;
};
import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";

export interface ResubmitTicketResponse {
    success: boolean;
    message: string;
    data: {
        ticket: {
            ticket_number: string;
            uuid: string;
            status: string;
        };
    };
}

export interface ResubmitTicketPayload {
    resubmission_reason: string;
    attachment?: File;
}

export const resubmitTicketApi = async (
    uuid: string,
    payload: ResubmitTicketPayload
): Promise<ResubmitTicketResponse> => {
    const formData = new FormData();
    formData.append('resubmission_reason', payload.resubmission_reason);
    
    if (payload.attachment) {
        formData.append('attachment', payload.attachment);
    }

    return apiRequest<ResubmitTicketResponse>(
        axios,
        "POST",
        route('ticket.resubmit', { uuid }),
        formData
    );
};

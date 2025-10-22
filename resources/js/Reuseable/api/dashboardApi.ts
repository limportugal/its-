import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";

// AXIOS INSTANCE FOR THE DASHBOARD MODULE
const dashboardApiClient = axios.create({
    baseURL: "/dashboard",
    timeout: 0,
    withCredentials: true,
});

// INTERFACES
export interface ProblemCategoryData {
    category_name: string;
    total: number;
}

export interface TicketSummaryData {
    status: string;
    total: number;
}

export interface TicketSummaryPerDayData {
    date: string;
    total: number;
}

// FETCH PROBLEM CATEGORY SUMMARY DATA
export const fetchProblemCategorySummaryData = async (): Promise<ProblemCategoryData[]> => {
    const response = await apiRequest<{ success: boolean; message: string; data: ProblemCategoryData[] }>(
        dashboardApiClient,
        "get",
        "/problem-category-summary",
    );
    return response.data;
};

// FETCH TICKET SUMMARY DATA
export const fetchTicketSummaryData = async (): Promise<TicketSummaryData[]> => {
    const response = await apiRequest<{ success: boolean; message: string; data: TicketSummaryData[] }>(
        dashboardApiClient,
        "get",
        "/ticket-summary",
    );
    return response.data;
};

// FETCH TICKET SUMMARY PER DAY DATA
export const fetchTicketSummaryPerDayData = async (): Promise<TicketSummaryPerDayData[]> => {
    const response = await apiRequest<{ success: boolean; message: string; data: TicketSummaryPerDayData[] }>(
        dashboardApiClient,
        "get",
        "/ticket-summary-per-day",
    );
    return response.data;
};

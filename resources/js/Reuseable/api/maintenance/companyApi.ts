import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { CompaniesResponse, CompanyCreationPayload, UpdateCompanyPayload } from "@/Reuseable/types/companyTypes";

// AXIOS INSTANCE FOR THE COMPANY MODULE
const companyApiClient = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// FETCH COMPANY DATA
export const fetchCompaniesData = async (): Promise<CompaniesResponse> => {
    const url = route('maintenance.companies.show');
    const response = await apiRequest<CompaniesResponse>(
        companyApiClient,
        "get",
        url,
    );
    return response;
};

// CREATE A NEW COMPANY
export const createCompanyData = async (createData: CompanyCreationPayload) => {
    const url = route('maintenance.companies.create');
    return apiRequest<CompanyCreationPayload>(
        companyApiClient,
        "post",
        url,
        createData,
    );
};

// UPDATE COMPANY INFORMATION
export const updateCompanyData = async (
    id: number,
    updateData: UpdateCompanyPayload,
) => {
    const url = route('maintenance.companies.update', { id });
    return apiRequest<UpdateCompanyPayload>(
        companyApiClient,
        "put",
        url,
        updateData,
    );
};

// DELETE COMPANY
export const deleteCompanyData = async (id: number): Promise<void> => {
    const url = route('maintenance.companies.delete', { id });
    await apiRequest(companyApiClient, "delete", url);
};

// ACTIVATE COMPANY
export const activateCompanyData = async (id: number): Promise<void> => {
    const url = route('maintenance.companies.activate', { id });
    await apiRequest(companyApiClient, "patch", url);
};

// INACTIVATE COMPANY
export const inactivateCompanyData = async (id: number): Promise<void> => {
    const url = route('maintenance.companies.inactivate', { id });
    await apiRequest(companyApiClient, "patch", url);
};
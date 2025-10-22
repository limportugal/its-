export type Company = {
    id: number;
    company_name: string;
    status: string;
};

export interface CompanyResponse {
    id: number;
    company_name: string;
    status: string;
    created_at: string;
}

export type CompaniesResponse = CompanyResponse[];

export interface CompanyCreationPayload {
    company_name: string;
    status?: string;
}

export interface UpdateCompanyPayload {
    id: number;
    company_name: string;
    status?: string;
}

export interface DeleteCompanyPayload {
    id: number;
    company_name: string;
    onDelete: () => void;
}

// COMPANY CREATE PROPS
export interface CreateProps {
    error: any;
    open: boolean;
    OpenDialog?: () => void;
    onClose: () => void;
    company?: Company;
    status: string;
    onSubmit: () => void;
    onSuccess?: () => void;
}
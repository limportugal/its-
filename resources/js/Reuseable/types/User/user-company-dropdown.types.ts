export interface UserCompanyDropdownItem {
    id: number;
    company_name: string;
    status: string;
}

export interface UserCompanyDropdownResponse {
    data: UserCompanyDropdownItem[];
}

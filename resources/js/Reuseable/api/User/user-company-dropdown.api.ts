import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { UserCompanyDropdownResponse } from "@/Reuseable/types/User/user-company-dropdown.types";

const userCompanyDropdownApiClient = axios.create({
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

export const fetchUserCompanyDropdownData = async (): Promise<UserCompanyDropdownResponse> => {
    const url = route('users.companiesDropdown');
    const response = await apiRequest<UserCompanyDropdownResponse>(
        userCompanyDropdownApiClient,
        "get",
        url,
    );
    return response;
};

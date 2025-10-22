import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { TeamLeaderDropdownResponse } from "@/Reuseable/types/User/team-leader-dropdown.types";

const teamLeaderDropdownApiClient = axios.create({
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

export const fetchTeamLeaderDropdownData = async (): Promise<TeamLeaderDropdownResponse> => {
    const url = route('users.teamLeadersDropdown');
    const response = await apiRequest<TeamLeaderDropdownResponse>(
        teamLeaderDropdownApiClient,
        "get",
        url,
    );
    return response;
};

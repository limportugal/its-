import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import {
    UsersResponse,
    UserCreationPayload,
    UpdateUserPayload,
    UserLoginPayload
} from "@/Reuseable/types/userTypes";

// AXIOS INSTANCE FOR THE TICKETS MODULE
const ticketsApiClient = axios.create({
    withCredentials: true,
});

// GET USER
export const getUser = async (): Promise<UsersResponse[]> => {
    const response = await apiRequest<UsersResponse[]>(
        ticketsApiClient,
        "get",
        "/get-user",
    );
    return response;
};

// CREATE A NEW USER
export const createUserData = async (createData: UserCreationPayload) => {
    return apiRequest<UserCreationPayload>(
        ticketsApiClient,
        "post",
        "/create-user",
        createData,
    );
};

// UPDATE USER INFORMATION
export const updateUserData = async (
    id: number,
    updatedData: UpdateUserPayload,
) => {
    return apiRequest<UpdateUserPayload>(
        ticketsApiClient,
        "put",
        `/update-user/${id}`,
        updatedData,
    );
};

// LOGIN API
export const userLogin = async (loginData: UserLoginPayload) => {
    return apiRequest<UserLoginPayload>(
        ticketsApiClient,
        "post",
        "/login",
        loginData,
    );
};

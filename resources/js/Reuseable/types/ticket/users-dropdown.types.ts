export interface UserDropdownItem {
    id: number;
    uuid: string;
    name: string;
    email: string;
    avatar_url: string | null;
    roles: string[];
}

export interface UsersDropdownResponse {
    data: UserDropdownItem[];
}

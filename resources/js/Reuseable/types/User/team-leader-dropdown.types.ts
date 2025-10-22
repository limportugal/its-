import { RolesDropdownItem } from '@/Reuseable/types/User/roles-dropdown.types';

interface TeamLeaderDropdownItem {
    id: number;
    uuid: string;
    name: string;
    email: string;
    avatar_url: string | null;
    roles: RolesDropdownItem[];
}

export interface TeamLeaderDropdownResponse {
    data: TeamLeaderDropdownItem[];
}
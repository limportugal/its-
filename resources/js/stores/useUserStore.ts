import { create } from 'zustand';
import { UsersResponse } from '@/Reuseable/types/userTypes';

interface UserStore {
    openDialog: boolean;
    isEdit: boolean;
    selectedUser: UsersResponse | null;
    showSnackBarAlert: boolean;
    company: string;
    role: string;
    teamLeader: string;
    setCompany: (company: string) => void;
    setRole: (role: string) => void;
    setTeamLeader: (teamLeader: string) => void;
    handleOpenDialog: (user?: any) => void;
    setOpenDialog: (open: boolean) => void;
    setIsEdit: (isEdit: boolean) => void;
    setSelectedUser: (user: UsersResponse | null) => void;
    setShowSnackBarAlert: (show: boolean) => void;
    openCreateDialog: () => void;
    openEditDialog: (user: UsersResponse) => void;
    handleCloseDialog: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
    openDialog: false,
    isEdit: false,
    selectedUser: null,
    showSnackBarAlert: false,
    company: "",
    role: "",
    teamLeader: "",
    setCompany: (company) => set({ company }),
    setRole: (role) => set({ role }),
    setTeamLeader: (teamLeader) => set({ teamLeader }),
    handleOpenDialog: (user?: any) => {
        set({ selectedUser: user });
    },
    setOpenDialog: (open) => {
        set({ openDialog: open });
    },
    setIsEdit: (isEdit) => {
        set({ isEdit });
    },
    setSelectedUser: (user) => {
        set({ selectedUser: user });
    },
    setShowSnackBarAlert: (show) => set({ showSnackBarAlert: show }),
    openCreateDialog: () => {
        set({
            openDialog: true,
            isEdit: false,
            selectedUser: null,
            company: "",
            role: "",
            teamLeader: "",
        });
    },
    openEditDialog: (user) => {
        set({
            openDialog: true,
            isEdit: true,
            selectedUser: user,
            company: user?.company?.id ? String(user.company.id) : "",
            role: user?.roles?.[0]?.id ? String(user?.roles?.[0]?.id) : "",
            teamLeader: user?.team_leader_id ? String(user.team_leader_id) : "",
        });
    },
    handleCloseDialog: () => {
        set({
            openDialog: false,
            isEdit: false,
            selectedUser: null,
            company: "",
            role: "",
            teamLeader: "",
        });
    }
})); 
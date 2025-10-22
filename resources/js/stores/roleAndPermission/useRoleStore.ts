import { create } from 'zustand';
import { Role, RolesResponse } from '@/Reuseable/types/rolesAndPermissions/roleTypes';

interface RoleStore {
    // States
    roles: RolesResponse[];
    selectedRole: Role | null;
    isDialogOpen: boolean;
    isEdit: boolean;
    handleOpen: () => void;
    // Actions
    setRoles: (roles: RolesResponse[]) => void;
    setSelectedRole: (role: Role | null) => void;
    setIsDialogOpen: (isOpen: boolean) => void;
    setIsEdit: (isEdit: boolean) => void;
    setHandleOpen: (handleOpen: () => void) => void;
    
    // Combined Actions
    handleOpenDialog: (role?: RolesResponse) => void;
    handleCloseDialog: () => void;
    resetState: () => void;
}

export const useRoleStore = create<RoleStore>((set) => ({
    // Initial states
    roles: [],
    selectedRole: null,
    isDialogOpen: false,
    isEdit: false,
    handleOpen: () => set({ isDialogOpen: true, isEdit: false, selectedRole: null }),

    // State setters
    setHandleOpen: (handleOpen) => set({ handleOpen }),
    setRoles: (roles) => set({ roles }),
    setSelectedRole: (role) => set({ selectedRole: role }),
    setIsDialogOpen: (isOpen) => set({ isDialogOpen: isOpen }),
    setIsEdit: (isEdit) => set({ isEdit }),

    // Combined actions
    handleOpenDialog: (role) => set((state) => ({
        selectedRole: role || null,
        isEdit: !!role,
        isDialogOpen: true,
    })),

    handleCloseDialog: () => set({
        isDialogOpen: false,
    }),

    resetState: () => set({
        selectedRole: null,
        isDialogOpen: false,
        isEdit: false,
    }),
})); 
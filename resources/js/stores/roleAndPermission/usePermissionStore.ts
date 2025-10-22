import { create } from 'zustand';
import { Permission, PermissionsResponse } from '@/Reuseable/types/rolesAndPermissions/permissionTypes';

interface PermissionStore {
    permissions: PermissionsResponse[];
    selectedPermission: Permission | null;
    isDialogOpen: boolean;
    isEdit: boolean;

    // ACTIONS
    setPermissions: (permissions: PermissionsResponse[]) => void;
    setSelectedPermission: (permission: Permission | null) => void;
    setIsDialogOpen: (isOpen: boolean) => void;
    setIsEdit: (isEdit: boolean) => void;

    // COMBINED ACTIONS
    handleOpenDialog: (permission?: PermissionsResponse) => void;
    handleCloseDialog: () => void;
    handleOpen: () => void;
    resetState: () => void;
}

export const usePermissionStore = create<PermissionStore>((set) => ({
    // INITIAL STATES
    permissions: [],
    selectedPermission: null,
    isDialogOpen: false,
    isEdit: false,

    // STATE SETTERS
    setPermissions: (permissions) => set({ permissions }),
    setSelectedPermission: (permission) => set({ selectedPermission: permission }),
    setIsDialogOpen: (isOpen) => set({ isDialogOpen: isOpen }),
    setIsEdit: (isEdit) => set({ isEdit }),

    // COMBINED ACTIONS
    handleOpenDialog: (permission) => set((state) => ({
        selectedPermission: permission || null,
        isEdit: !!permission,
        isDialogOpen: true,
    })),

    handleCloseDialog: () => set({
        isDialogOpen: false,
    }),

    handleOpen: () => set({
        isDialogOpen: true,
        isEdit: false,
        selectedPermission: null,
    }),

    resetState: () => set({
        selectedPermission: null,
        isDialogOpen: false,
        isEdit: false,
    }),
})); 
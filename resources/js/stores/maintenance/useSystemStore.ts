import { create } from 'zustand';
import { SystemsResponse, System } from '@/Reuseable/types/system.types';

interface SystemStore {
    systems: SystemsResponse[];
    selectedSystem: System | null;
    isDialogOpen: boolean;
    isEdit: boolean;

    // ACTIONS
    setSystems: (systems: SystemsResponse[]) => void;
    setSelectedSystem: (system: System | null) => void;
    setIsDialogOpen: (isOpen: boolean) => void;
    setIsEdit: (isEdit: boolean) => void;

    // COMBINED ACTIONS
    handleOpenDialog: (system?: System) => void;
    handleCloseDialog: () => void;
    handleOpen: () => void;
    resetState: () => void;
}

export const useSystemStore = create<SystemStore>((set) => ({
    // INITIAL STATES
    systems: [],
    selectedSystem: null,
    isDialogOpen: false,
    isEdit: false,

    // STATE SETTERS
    setSystems: (systems) => set({ systems }),
    setSelectedSystem: (system) => set({ selectedSystem: system }),
    setIsDialogOpen: (isOpen) => set({ isDialogOpen: isOpen }),
    setIsEdit: (isEdit) => set({ isEdit }),

    // COMBINED ACTIONS
    handleOpenDialog: (system) => set({
        selectedSystem: system || null,
        isEdit: !!system,
        isDialogOpen: true,
    }),

    handleCloseDialog: () => set({
        isDialogOpen: false,
    }),

    handleOpen: () => set({
        isDialogOpen: true,
        isEdit: false,
        selectedSystem: null,
    }),

    resetState: () => set({
        selectedSystem: null,
        isDialogOpen: false,
        isEdit: false,
    }),
})); 
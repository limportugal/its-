import { create } from 'zustand';
import { Priority } from '@/Reuseable/types/priorityTypes';
import { PriorityResponse } from '@/Reuseable/types/priorityTypes';

interface PriorityStore {
    priorities: PriorityResponse[];
    selectedPriority: Priority | null;
    isDialogOpen: boolean;
    isEdit: boolean;

    // ACTIONS
    setPriorities: (priorities: PriorityResponse[]) => void;
    setSelectedPriority: (priority: Priority | null) => void;
    setIsDialogOpen: (isOpen: boolean) => void;
    setIsEdit: (isEdit: boolean) => void;

    // COMBINED ACTIONS
    handleOpenDialog: (priority?: Priority) => void;
    handleCloseDialog: () => void;
    handleOpen: () => void;
    resetState: () => void;
}

export const usePriorityStore = create<PriorityStore>((set) => ({
    // INITIAL STATES
    priorities: [],
    selectedPriority: null,
    isDialogOpen: false,
    isEdit: false,

    // STATE SETTERS
    setPriorities: (priorities) => set({ priorities }),
    setSelectedPriority: (priority) => set({ selectedPriority: priority }),
    setIsDialogOpen: (isOpen) => set({ isDialogOpen: isOpen }),
    setIsEdit: (isEdit) => set({ isEdit }),

    // COMBINED ACTIONS
    handleOpenDialog: (priority) => set((state) => ({
        selectedPriority: priority || null,
        isEdit: !!priority,
        isDialogOpen: true,
    })),

    handleCloseDialog: () => set({
        isDialogOpen: false,
    }),

    handleOpen: () => set({
        isDialogOpen: true,
        isEdit: false,
        selectedPriority: null,
    }),

    resetState: () => set({
        selectedPriority: null,
        isDialogOpen: false,
        isEdit: false,
    }),
})); 
import { create } from "zustand";
import { Ownership, OwnershipResponse } from "@/Reuseable/types/ownershipTypes";

interface OwnershipStore {
    ownerships: OwnershipResponse[];
    selectedOwnership: Ownership | null;
    isDialogOpen: boolean;
    isEdit: boolean;

    setOwnerships: (ownerships: OwnershipResponse[]) => void;
    setSelectedOwnership: (ownership: Ownership | null) => void;
    setIsDialogOpen: (isOpen: boolean) => void;
    setIsEdit: (isEdit: boolean) => void;

    handleOpenDialog: (ownership?: Ownership) => void;
    handleCloseDialog: () => void;
    handleOpen: () => void;
    resetState: () => void;
}

export const useOwnershipStore = create<OwnershipStore>((set) => ({
    ownerships: [],
    selectedOwnership: null,
    isDialogOpen: false,
    isEdit: false,

    setOwnerships: (ownerships) => set({ ownerships }),
    setSelectedOwnership: (ownership) => set({ selectedOwnership: ownership }),
    setIsDialogOpen: (isOpen) => set({ isDialogOpen: isOpen }),
    setIsEdit: (isEdit) => set({ isEdit }),

    handleOpenDialog: (ownership) =>
        set({
            selectedOwnership: ownership || null,
            isEdit: !!ownership,
            isDialogOpen: true,
        }),

    handleCloseDialog: () =>
        set({
            isDialogOpen: false,
        }),

    handleOpen: () =>
        set({
            isDialogOpen: true,
            isEdit: false,
            selectedOwnership: null,
        }),

    resetState: () =>
        set({
            selectedOwnership: null,
            isDialogOpen: false,
            isEdit: false,
        }),
}));


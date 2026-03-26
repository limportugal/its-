import { create } from "zustand";
import { StoreType, StoreTypeResponse } from "@/Reuseable/types/storeTypeTypes";

interface StoreTypeStore {
    storeTypes: StoreTypeResponse[];
    selectedStoreType: StoreType | null;
    isDialogOpen: boolean;
    isEdit: boolean;

    setStoreTypes: (storeTypes: StoreTypeResponse[]) => void;
    setSelectedStoreType: (storeType: StoreType | null) => void;
    setIsDialogOpen: (isOpen: boolean) => void;
    setIsEdit: (isEdit: boolean) => void;

    handleOpenDialog: (storeType?: StoreType) => void;
    handleCloseDialog: () => void;
    handleOpen: () => void;
    resetState: () => void;
}

export const useStoreTypeStore = create<StoreTypeStore>((set) => ({
    storeTypes: [],
    selectedStoreType: null,
    isDialogOpen: false,
    isEdit: false,

    setStoreTypes: (storeTypes) => set({ storeTypes }),
    setSelectedStoreType: (storeType) => set({ selectedStoreType: storeType }),
    setIsDialogOpen: (isOpen) => set({ isDialogOpen: isOpen }),
    setIsEdit: (isEdit) => set({ isEdit }),

    handleOpenDialog: (storeType) =>
        set({
            selectedStoreType: storeType || null,
            isEdit: !!storeType,
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
            selectedStoreType: null,
        }),

    resetState: () =>
        set({
            selectedStoreType: null,
            isDialogOpen: false,
            isEdit: false,
        }),
}));


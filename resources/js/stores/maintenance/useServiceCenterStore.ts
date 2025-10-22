import { create } from 'zustand';
import { ServiceCenter, ServiceCentersResponse } from '@/Reuseable/types/service-center.types';

interface ServiceCenterStore {
    serviceCenters: ServiceCentersResponse[];
    selectedServiceCenter: ServiceCenter | null;
    isDialogOpen: boolean;
    isEdit: boolean;

    // ACTIONS
    setServiceCenters: (serviceCenters: ServiceCentersResponse[]) => void;
    setSelectedServiceCenter: (serviceCenter: ServiceCenter | null) => void;
    setIsDialogOpen: (isOpen: boolean) => void;
    setIsEdit: (isEdit: boolean) => void;

    // COMBINED ACTIONS
    handleOpenDialog: (serviceCenter?: ServiceCenter) => void;
    handleCloseDialog: () => void;
    handleOpen: () => void;
    resetState: () => void;
}

export const useServiceCenterStore = create<ServiceCenterStore>((set) => ({
    // INITIAL STATES
    serviceCenters: [],
    selectedServiceCenter: null,
    isDialogOpen: false,
    isEdit: false,

    // STATE SETTERS
    setServiceCenters: (serviceCenters) => set({ serviceCenters }),
    setSelectedServiceCenter: (serviceCenter) => set({ selectedServiceCenter: serviceCenter }),
    setIsDialogOpen: (isOpen) => set({ isDialogOpen: isOpen }),
    setIsEdit: (isEdit) => set({ isEdit }),

    // COMBINED ACTIONS
    handleOpenDialog: (serviceCenter) => set({
        selectedServiceCenter: serviceCenter || null,
        isEdit: !!serviceCenter,
        isDialogOpen: true,
    }),

    handleCloseDialog: () => set({
        isDialogOpen: false,
    }),

    handleOpen: () => set({
        isDialogOpen: true,
        isEdit: false,
        selectedServiceCenter: null,
    }),

    resetState: () => set({
        selectedServiceCenter: null,
        isDialogOpen: false,
        isEdit: false,
    }),
})); 
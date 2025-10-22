import { create } from 'zustand';
import { Company } from '@/Reuseable/types/companyTypes';
import { CompaniesResponse } from '@/Reuseable/types/companyTypes';

interface CompanyStore {
    companies: CompaniesResponse[];
    selectedCompany: Company | null;
    isDialogOpen: boolean;
    isEdit: boolean;

    // ACTIONS
    setCompanies: (companies: CompaniesResponse[]) => void;
    setSelectedCompany: (company: Company | null) => void;
    setIsDialogOpen: (isOpen: boolean) => void;
    setIsEdit: (isEdit: boolean) => void;

    // COMBINED ACTIONS
    handleOpenDialog: (company?: Company) => void;
    handleCloseDialog: () => void;
    handleOpen: () => void;
    resetState: () => void;
}

export const useCompanyStore = create<CompanyStore>((set) => ({
    // INITIAL STATES
    companies: [],
    selectedCompany: null,
    isDialogOpen: false,
    isEdit: false,

    // STATE SETTERS
    setCompanies: (companies) => set({ companies }),
    setSelectedCompany: (company) => set({ selectedCompany: company }),
    setIsDialogOpen: (isOpen) => set({ isDialogOpen: isOpen }),
    setIsEdit: (isEdit) => set({ isEdit }),

    // COMBINED ACTIONS
    handleOpenDialog: (company) => set({
        selectedCompany: company || null,
        isEdit: !!company,
        isDialogOpen: true,
    }),

    handleCloseDialog: () => set({
        isDialogOpen: false,
    }),

    handleOpen: () => set({
        isDialogOpen: true,
        isEdit: false,
        selectedCompany: null,
    }),

    resetState: () => set({
        selectedCompany: null,
        isDialogOpen: false,
        isEdit: false,
    }),
})); 
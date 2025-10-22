import { create } from 'zustand';
import { CategoriesResponse, Category } from '@/Reuseable/types/categoryTypes';

interface CategoryStore {
    categories: CategoriesResponse[];
    selectedCategory: Category | null;
    isDialogOpen: boolean;
    isEdit: boolean;

    // ACTIONS
    setCategories: (categories: CategoriesResponse[]) => void;
    setSelectedCategory: (category: Category | null) => void;
    setIsDialogOpen: (isOpen: boolean) => void;
    setIsEdit: (isEdit: boolean) => void;

    // COMBINED ACTIONS
    handleOpenDialog: (category?: Category) => void;
    handleCloseDialog: () => void;
    handleOpen: () => void;
    resetState: () => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
    // INITIAL STATES
    categories: [],
    selectedCategory: null,
    isDialogOpen: false,
    isEdit: false,

    // STATE SETTERS
    setCategories: (categories) => set({ categories }),
    setSelectedCategory: (category) => set({ selectedCategory: category }),
    setIsDialogOpen: (isOpen) => set({ isDialogOpen: isOpen }),
    setIsEdit: (isEdit) => set({ isEdit }),

    // COMBINED ACTIONS
    handleOpenDialog: (category) => set({
        selectedCategory: category || null,
        isEdit: !!category,
        isDialogOpen: true,
    }),

    handleCloseDialog: () => set({
        isDialogOpen: false,
    }),

    handleOpen: () => set({
        isDialogOpen: true,
        isEdit: false,
        selectedCategory: null,
    }),

    resetState: () => set({
        selectedCategory: null,
        isDialogOpen: false,
        isEdit: false,
    }),
})); 
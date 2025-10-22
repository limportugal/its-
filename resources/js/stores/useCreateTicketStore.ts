import { create } from 'zustand';

interface CreateTicketStore {
  isDialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  toggleDialog: () => void;
}

export const useCreateTicketStore = create<CreateTicketStore>((set) => ({
  isDialogOpen: false,
  openDialog: () => set({ isDialogOpen: true }),
  closeDialog: () => set({ isDialogOpen: false }),
  toggleDialog: () => set((state) => ({ isDialogOpen: !state.isDialogOpen })),
}));

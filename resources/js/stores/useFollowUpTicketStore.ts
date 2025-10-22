import { create } from 'zustand';
import { TicketsResponse } from '@/Reuseable/types/ticketTypes';

interface FollowUpTicketStore {
    // States
    isDialogOpen: boolean;
    selectedTicket: TicketsResponse | null;
    
    // Actions
    setIsDialogOpen: (isOpen: boolean) => void;
    setSelectedTicket: (ticket: TicketsResponse | null) => void;
    
    // Combined Actions
    handleOpenDialog: (ticket: TicketsResponse) => void;
    handleCloseDialog: () => void;
    resetState: () => void;
}

export const useFollowUpTicketStore = create<FollowUpTicketStore>((set) => ({
    // Initial States
    isDialogOpen: false,
    selectedTicket: null,
    
    // Actions
    setIsDialogOpen: (isOpen: boolean) => set({ isDialogOpen: isOpen }),
    setSelectedTicket: (ticket: TicketsResponse | null) => set({ selectedTicket: ticket }),
    
    // Combined Actions
    handleOpenDialog: (ticket: TicketsResponse) => set({ 
        isDialogOpen: true, 
        selectedTicket: ticket 
    }),
    handleCloseDialog: () => set({ 
        isDialogOpen: false, 
        selectedTicket: null 
    }),
    resetState: () => set({ 
        isDialogOpen: false, 
        selectedTicket: null 
    }),
}));

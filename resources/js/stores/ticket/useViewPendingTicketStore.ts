import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ActiveAttachment {
    url: string;
    name: string | null;
}

interface ViewPendingTicketState {
    // DIALOG STATES
    openReturnDialog: boolean;
    openActionTakenDialog: boolean;
    openDeleteAlert: boolean;
    openCancelTicketDialog: boolean;
    
    // TAB STATE
    activeTab: string;
    
    // ATTACHMENT STATE
    activeAttachment: ActiveAttachment;
    
    // ACTIONS FOR DIALOG STATES
    setOpenReturnDialog: (open: boolean) => void;
    setOpenActionTakenDialog: (open: boolean) => void;
    setOpenDeleteAlert: (open: boolean) => void;
    setOpenCancelTicketDialog: (open: boolean) => void;
    
    // ACTIONS FOR TAB STATE
    setActiveTab: (tab: string) => void;
    
    // ACTIONS FOR ATTACHMENT STATE
    setActiveAttachment: (attachment: ActiveAttachment) => void;
    
    // RESET ALL STATES
    resetStore: () => void;
}

// INITIAL STATE
const initialState = {
    openReturnDialog: false,
    openActionTakenDialog: false,
    openDeleteAlert: false,
    openCancelTicketDialog: false,
    activeTab: '1',
    activeAttachment: { url: "", name: null },
};

// CREATE THE STORE
export const useViewPendingTicketStore = create<ViewPendingTicketState>()(
    devtools(
        (set, get) => ({
            ...initialState,
            
            // DIALOG STATE ACTIONS
            setOpenReturnDialog: (open: boolean) =>
                set({ openReturnDialog: open }, false, 'setOpenReturnDialog'),
            
            setOpenActionTakenDialog: (open: boolean) =>
                set({ openActionTakenDialog: open }, false, 'setOpenActionTakenDialog'),
            
            setOpenDeleteAlert: (open: boolean) =>
                set({ openDeleteAlert: open }, false, 'setOpenDeleteAlert'),
            
            setOpenCancelTicketDialog: (open: boolean) =>
                set({ openCancelTicketDialog: open }, false, 'setOpenCancelTicketDialog'),
            
            // TAB STATE ACTIONS
            setActiveTab: (tab: string) =>
                set({ activeTab: tab }, false, 'setActiveTab'),
            
            // ATTACHMENT STATE ACTIONS
            setActiveAttachment: (attachment: ActiveAttachment) =>
                set({ activeAttachment: attachment }, false, 'setActiveAttachment'),
            
            // RESET ALL STATES
            resetStore: () =>
                set(initialState, false, 'resetStore'),
        }),
        {
            name: 'view-pending-ticket-store',
        }
    )
);

// SELECTORS FOR BETTER PERFORMANCE
export const useViewPendingTicketSelectors = {
    // DIALOG SELECTORS
    useReturnDialog: () => {
        const open = useViewPendingTicketStore((state) => state.openReturnDialog);
        const setOpen = useViewPendingTicketStore((state) => state.setOpenReturnDialog);
        return { open, setOpen };
    },
    
    useActionTakenDialog: () => {
        const open = useViewPendingTicketStore((state) => state.openActionTakenDialog);
        const setOpen = useViewPendingTicketStore((state) => state.setOpenActionTakenDialog);
        return { open, setOpen };
    },
    
    useDeleteAlert: () => {
        const open = useViewPendingTicketStore((state) => state.openDeleteAlert);
        const setOpen = useViewPendingTicketStore((state) => state.setOpenDeleteAlert);
        return { open, setOpen };
    },
    
    useCancelTicketDialog: () => {
        const open = useViewPendingTicketStore((state) => state.openCancelTicketDialog);
        const setOpen = useViewPendingTicketStore((state) => state.setOpenCancelTicketDialog);
        return { open, setOpen };
    },
    
    // TAB SELECTOR
    useTab: () => {
        const activeTab = useViewPendingTicketStore((state) => state.activeTab);
        const setActiveTab = useViewPendingTicketStore((state) => state.setActiveTab);
        return { activeTab, setActiveTab };
    },
    
    // ATTACHMENT SELECTOR
    useAttachment: () => {
        const activeAttachment = useViewPendingTicketStore((state) => state.activeAttachment);
        const setActiveAttachment = useViewPendingTicketStore((state) => state.setActiveAttachment);
        return { activeAttachment, setActiveAttachment };
    },
};

export default useViewPendingTicketStore;
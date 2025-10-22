import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ActiveAttachment {
    url: string;
    name: string | null;
}

interface ViewClosedTicketState {
    // DIALOG STATES
    openReopenTicketDialog: boolean;
    
    // TAB STATE
    activeTab: string;
    
    // ATTACHMENT STATE
    activeAttachment: ActiveAttachment;
    
    // ACTIONS FOR DIALOG STATES
    setOpenReopenTicketDialog: (open: boolean) => void;
    
    // ACTIONS FOR TAB STATE
    setActiveTab: (tab: string) => void;
    
    // ACTIONS FOR ATTACHMENT STATE
    setActiveAttachment: (attachment: ActiveAttachment) => void;
    
    // RESET ALL STATES
    resetStore: () => void;
}

// INITIAL STATE
const initialState = {
    openReopenTicketDialog: false,
    activeTab: '1',
    activeAttachment: { url: "", name: null },
};

// CREATE THE STORE
export const useViewClosedTicketStore = create<ViewClosedTicketState>()(
    devtools(
        (set, get) => ({
            ...initialState,
            
            // DIALOG STATE ACTIONS
            setOpenReopenTicketDialog: (open: boolean) =>
                set({ openReopenTicketDialog: open }, false, 'setOpenReopenTicketDialog'),
            
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
            name: 'view-closed-ticket-store',
        }
    )
);

// SELECTORS FOR BETTER PERFORMANCE
export const useViewClosedTicketSelectors = {
    // DIALOG SELECTOR
    useReopenTicketDialog: () => {
        const open = useViewClosedTicketStore((state) => state.openReopenTicketDialog);
        const setOpen = useViewClosedTicketStore((state) => state.setOpenReopenTicketDialog);
        return { open, setOpen };
    },
    
    // TAB SELECTOR
    useTab: () => {
        const activeTab = useViewClosedTicketStore((state) => state.activeTab);
        const setActiveTab = useViewClosedTicketStore((state) => state.setActiveTab);
        return { activeTab, setActiveTab };
    },
    
    // ATTACHMENT SELECTOR
    useAttachment: () => {
        const activeAttachment = useViewClosedTicketStore((state) => state.activeAttachment);
        const setActiveAttachment = useViewClosedTicketStore((state) => state.setActiveAttachment);
        return { activeAttachment, setActiveAttachment };
    },
};

export default useViewClosedTicketStore;

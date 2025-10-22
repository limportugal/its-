import { UserLogsResponse, UserLogsStore } from "@/Reuseable/types/userLogsTypes";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

const useUserLogsStore = create<UserLogsStore>()(
    subscribeWithSelector((set, get) => ({
        openDialog: false,
        selectedLog: null,
        setOpenDialog: (open: boolean) => {
            const currentState = get();
            if (currentState.openDialog !== open) {
                set({ openDialog: open });
            }
        },
        setSelectedLog: (log: UserLogsResponse | null) => {
            const currentState = get();
            if (currentState.selectedLog?.id !== log?.id) {
                set({ selectedLog: log });
            }
        },
    }))
);

export default useUserLogsStore;



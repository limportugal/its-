import { create } from 'zustand'

interface DrawerState {
    mobileOpen: boolean
    isMiniDrawer: boolean
    isClosing: boolean
    isMobileExpanded: boolean
    setMobileOpen: (value: boolean) => void
    setIsMiniDrawer: (value: boolean) => void
    setIsClosing: (value: boolean) => void
    setIsMobileExpanded: (value: boolean) => void
    toggleMobileOpen: () => void
    toggleMiniDrawer: () => void
}

const useDrawerStore = create<DrawerState>((set) => ({
    mobileOpen: false,
    isMiniDrawer: true,
    isClosing: false,
    isMobileExpanded: false,
    setMobileOpen: (value) => set({ mobileOpen: value }),
    setIsMiniDrawer: (value) => set({ isMiniDrawer: value }),
    setIsClosing: (value) => set({ isClosing: value }),
    setIsMobileExpanded: (value) => set({ isMobileExpanded: value }),
    toggleMobileOpen: () => set((state) => ({ 
        mobileOpen: !state.mobileOpen,
        isMobileExpanded: !state.mobileOpen // When opening mobile drawer, set to expanded
    })),
    toggleMiniDrawer: () => set((state) => ({
        isMiniDrawer: !state.isMiniDrawer
    })),
}))

export default useDrawerStore 
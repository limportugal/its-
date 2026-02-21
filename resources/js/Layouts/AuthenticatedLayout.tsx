import React, { ReactNode, useEffect, JSX } from "react";
import Box from "@mui/material/Box";
import AppBarComponent from "./components/AppBar";
import DrawerComponent from "./components/Drawer";
import MainContent from "./components/MainContent";
import SessionExpiryDialog from "./components/SessionExpiryDialog";
import useDrawerStore from "../stores/useDrawerStore";

const drawerWidth = 240;
const miniDrawerWidth = 105;

type AuthenticatedLayoutProps = {
    header?: ReactNode;
    children: ReactNode;
};

// AUTHENTICATED LAYOUT COMPONENT
const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ header, children }) => {
    const {
        mobileOpen,
        isMiniDrawer,
        isClosing,
        setMobileOpen,
        setIsClosing,
        setIsMiniDrawer,
        toggleMobileOpen,
        toggleMiniDrawer
    } = useDrawerStore();

    // HANDLE DRAWER CLOSE
    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    // HANDLE DRAWER TRANSITION END
    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    // HANDLE DRAWER TOGGLE
    const handleDrawerToggle = () => {
        if (!isClosing) {
            toggleMobileOpen();
        }
    };


    // RENDER THE COMPONENT
    return (
        <Box sx={{ display: "flex" }}>
            <SessionExpiryDialog />
            <AppBarComponent
                handleDrawerToggle={handleDrawerToggle}
                isMiniDrawer={isMiniDrawer}
                toggleMiniDrawer={toggleMiniDrawer}
            />
            <Box>
                <DrawerComponent
                    mobileOpen={mobileOpen}
                    isMiniDrawer={isMiniDrawer}
                    handleDrawerClose={handleDrawerClose}
                    handleDrawerTransitionEnd={handleDrawerTransitionEnd}
                />
            </Box>
            <MainContent
                header={header}
                isMiniDrawer={isMiniDrawer}
                drawerWidth={drawerWidth}
                miniDrawerWidth={miniDrawerWidth}
            >
                {children}
            </MainContent>
        </Box>
    );
};

export default AuthenticatedLayout;

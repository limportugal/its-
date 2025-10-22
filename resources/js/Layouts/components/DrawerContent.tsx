import React from "react";
import { Box, List } from "@mui/material";
import MenuItem from "./MenuItem";
import { MenuItem as MenuItemType } from "./types/DrawerTypes";
import SidebarFooter from "./SidebarFooter";

interface DrawerContentProps {
    drawerWidth: number;
    miniDrawerWidth: number;
    isMiniDrawer: boolean;
    navMenu: MenuItemType[];
    selected: string | null;
    open: Record<number, boolean>;
    handleToggle: (index: number) => void;
    handleSelect: (index: string) => void;
}

const DrawerContent: React.FC<DrawerContentProps> = ({
    drawerWidth,
    miniDrawerWidth,
    isMiniDrawer,
    navMenu,
    selected,
    open,
    handleToggle,
    handleSelect,
}) => {
    return (
        <Box
            sx={{
                padding: 1,
                position: "static",
                left: 0,
                backgroundColor: "transparent",
                height: "100%",
                boxShadow: "none",
                width: isMiniDrawer ? miniDrawerWidth : drawerWidth,
                zIndex: 1300,
                overflowX: "hidden",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <List sx={{ overflowX: "hidden", flexGrow: 1 }}>
                {navMenu.map(
                    (item, index) =>
                        item && (
                            <MenuItem
                                key={item.title || `item-${index}`}
                                item={item}
                                index={index}
                                selected={selected}
                                open={open}
                                isMiniDrawer={isMiniDrawer}
                                handleToggle={handleToggle}
                                handleSelect={handleSelect}
                            />
                        ),
                )}
            </List>
            <Box sx={{  mt: "auto", justifyContent: 'center', textAlign: 'center' }}>
                <SidebarFooter mini={isMiniDrawer} />
            </Box>
        </Box>
    );
};

export default React.memo(DrawerContent);

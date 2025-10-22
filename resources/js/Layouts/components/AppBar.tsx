import React from "react";
import { AppBar, IconButton, Toolbar, Tooltip, useMediaQuery, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Menu as MenuIcon, MenuOpen as MenuOpenIcon } from "@mui/icons-material";
import AppNameComponent from "./AppName";
import AccountMenu from "./AccountMenu";
import HeaderDateTime from "@/Components/Mui/HeaderDateTime";

// APP BAR COMPONENT PROPS
interface AppBarComponentProps {
    handleDrawerToggle: () => void;
    isMiniDrawer: boolean;
    toggleMiniDrawer: () => void;
}

const AppBarComponent: React.FC<AppBarComponentProps> = ({      
    handleDrawerToggle,
    isMiniDrawer,
    toggleMiniDrawer,
}) => {
    const theme = useTheme(),
        isMobile = useMediaQuery(theme.breakpoints.down("sm")),
        isSmallScreen = useMediaQuery('(max-width: 675px)'),
        handleClick = () =>
            isMobile ? handleDrawerToggle() : toggleMiniDrawer();

    return (
        <AppBar
            position="fixed"
            sx={{
                borderBottom: "1px solid #ddd",
                boxShadow: "none",
                color: "text.secondary",
                bgcolor: "background.paper",
            }}
        >
            <Toolbar>
                <Tooltip
                    title={
                        isMobile
                            ? "Open Drawer"
                            : isMiniDrawer
                              ? "Expand Menu"
                              : "Collapse Menu"
                    }
                >
                    <IconButton
                        color="inherit"
                        aria-label={
                            isMobile ? "open drawer" : "toggle mini drawer"
                        }
                        edge="start"
                        onClick={handleClick}
                        sx={{
                            mr: isMobile ? 0.5 : (isMiniDrawer ? 2 : 3),
                            ml: isMiniDrawer ? 0.3 : -0.8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {isMobile || isMiniDrawer ? (
                            <MenuIcon />
                        ) : (
                            <MenuOpenIcon />
                        )}
                    </IconButton>
                </Tooltip>
                <AppNameComponent />
                
                {/* Show AccountMenu on all screen sizes, HeaderDateTime only on desktop */}
                <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 2 }}>
                    {!isSmallScreen && (
                        <HeaderDateTime 
                            variant="light" 
                            size="large" 
                            showSeconds={true}
                        />
                    )}
                    <AccountMenu />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default AppBarComponent;

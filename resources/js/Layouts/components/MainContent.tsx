import React, { ReactNode } from "react";
import Box from "@mui/material/Box";

type MainContentProps = {
    header?: ReactNode;
    children: ReactNode;
    isMiniDrawer: boolean;
    drawerWidth: number;
    miniDrawerWidth: number;
};

const MainContent: React.FC<MainContentProps> = ({
    header,
    children,
    isMiniDrawer,
    drawerWidth,
    miniDrawerWidth
}) => {
    return (
        <Box
            sx={{
                flexGrow: 1,
                p: 2,
                m: 0,
                pt: { xs: 10, sm: 9 },
                maxWidth: "100%",
                overflow: "auto",
                transition: "width 0.3s ease",
                width: isMiniDrawer ? miniDrawerWidth : drawerWidth,
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {header}
            {children}
        </Box>
    );
};

export default MainContent;

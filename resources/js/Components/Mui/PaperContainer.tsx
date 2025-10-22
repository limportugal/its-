import React, { ReactNode } from "react";
import { Paper, Box, Typography } from "@mui/material";
import AddButton from "./AddButton";

type PaperContainerProps = {
    title: string;
    onAddButtonClick: () => void;
    children: ReactNode;
    hideAddButton?: boolean;
};

const PaperContainer: React.FC<PaperContainerProps> = ({
    title,
    onAddButtonClick = () => {},
    children,
    hideAddButton = false,
}) => {
    return (
        <Paper
            variant="outlined"
            sx={{
                borderRadius: "8px",
                height: "auto",
                width: "100%",
                maxWidth: "100%",
                mt: 1,
                p: 2,
                "@media (max-width:600px)": { p: 1 },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                }}
            >
                <Typography variant="h6" sx={{ fontSize: "1.2rem", fontWeight: "600", color: "#444" }}>{title}</Typography>
                {!hideAddButton && <AddButton onClick={onAddButtonClick} />}
            </Box>
            {children}
        </Paper>
    );
};

export default PaperContainer;
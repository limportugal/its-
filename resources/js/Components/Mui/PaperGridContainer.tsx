import React, { ReactNode } from "react";
import { Paper } from "@mui/material";

type PaperGridContainerProps = {
    children: ReactNode;
};

const PaperGridContainer: React.FC<PaperGridContainerProps> = ({
    children,
}) => {
    return (
        <Paper
            variant="outlined"
            sx={{
                borderRadius: "8px",
                height: "auto",
                width: "100%",
                maxWidth: "100%",
                mt: {xs: -1, sm:1},
                borderWidth: '0.5px',
                borderColor: 'rgba(0, 0, 0, 0.10)',
            }}
        >
            {children}
        </Paper>
    );
};

export default PaperGridContainer;

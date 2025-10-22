import React from "react";
import { IconButton, Tooltip, Zoom, AppBar } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

type VisibilityProps = {
    onClick: () => void;
    label?: string;
    icon?: React.ReactNode;
};

const VisibilityButton: React.FC<VisibilityProps> = ({
    onClick,
    icon = <VisibilityOutlinedIcon />,
}) => {
    return (
        <Tooltip
            title="VIEW"
            arrow
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 500 }}
        >
            <span>
                <IconButton
                    aria-label="view"
                    onClick={onClick}
                >
                    {icon}
                </IconButton>
            </span>
        </Tooltip>
    );
};

export default VisibilityButton;

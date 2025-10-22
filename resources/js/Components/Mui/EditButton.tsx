import React from "react";
import { IconButton, Tooltip, Zoom, AppBar } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import EditNoteIcon from "@mui/icons-material/EditNote";

type EditButtonProps = {
    onClick: () => void;
    label?: string;
    icon?: React.ReactNode;
};

const EditButton: React.FC<EditButtonProps> = ({
    onClick,
    icon = <EditNoteIcon />,
}) => {
    return (
        <Tooltip
            title="EDIT"
            arrow
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 500 }}
        >
            <span>
                <IconButton
                    color="primary"
                    aria-label="edit"
                    onClick={onClick}
                >
                    {icon}
                </IconButton>
            </span>
        </Tooltip>
    );
};

export default EditButton;

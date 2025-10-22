import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import ReportIcon from "@mui/icons-material/Report";
import { Tooltip, IconButton, Zoom } from "@mui/material";
import CircularProgressWithLabel from "@/Components/Mui/CircularProgressWithLabel";
import {
    showDeletedSuccessAlert,
    showDeleteConfirmationAlert,
    showDeleteErrorAlert,
} from "@/Reuseable/helpers/deleteComfirmationAlerts";

export interface DeleteProps {
    resourceId: number;
    resourceName: string;
    onDelete: () => void;
    deleteResource: (id: number) => Promise<void>;
}

const DeleteResource: React.FC<DeleteProps> = ({
    resourceId,
    resourceName,
    onDelete,
    deleteResource,
}) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handleDelete = async () => {
        const confirmed = await showDeleteConfirmationAlert(
            undefined,
            `Do you really want to delete this <span style="color: #1565c0;">"${resourceName}"</span>?<br/> 
            <span style="font-weight: 500;">This action cannot be undone.</span>`,
        );

        if (confirmed) {
            setIsDeleting(true);
            setHasError(false);

            try {
                await deleteResource(resourceId);
                onDelete();
                await showDeletedSuccessAlert(
                    undefined,
                    `<span style="color: #1565c0;">"${resourceName}"</span> has been deleted successfully.`,
                );
            } catch (error) {
                setHasError(true);
                await showDeleteErrorAlert(
                    undefined,
                    `<span style="color: #1565c0;">"${resourceName}"</span> could not be deleted. 
                    <br/>Please try again later. If the problem persists, <br/>contact our support team for assistance.`,
                );
            } finally {
                setIsDeleting(false);
            }
        }
    };

    return (
        <Tooltip
            title="DELETE"
            arrow
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 500 }}
        >
            <span>
                <IconButton
                    color="error"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? (
                        hasError ? (
                            <ReportIcon />
                        ) : (
                            <CircularProgressWithLabel />
                        )
                    ) : (
                        <DeleteIcon />
                    )}
                </IconButton>
            </span>
        </Tooltip>
    );
};

export default DeleteResource;

import { useState } from "react";

export const useActionDialogs = () => {
    const [editOpen, setEditOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [deactivateOpen, setDeactivateOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const handleKebabMenuOption = (option: string) => {
        switch (option) {
            case "Edit":
                setEditOpen(true);
                break;
            case "View":
                setViewOpen(true);
                break;
            case "Deactivate":
                setDeactivateOpen(true);
                break;
            case "Delete":
                setDeleteOpen(true);
                break;
            default:
        }
    };

    return {
        editOpen,
        viewOpen,
        deactivateOpen,
        deleteOpen,
        setEditOpen,
        setViewOpen,
        setDeactivateOpen,
        setDeleteOpen,
        handleKebabMenuOption,
    };
};

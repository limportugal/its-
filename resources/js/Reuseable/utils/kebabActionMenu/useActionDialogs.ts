import { useState } from "react";

export const useActionDialogs = () => {
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const handleKebabMenuOption = (option: string) => {
        switch (option) {
            case "Create":
                setCreateOpen(true);
                break;
            case "Edit":
                setEditOpen(true);
                break;
            case "Delete":
                setDeleteOpen(true);
                break;
            default:
                // Unknown option handled silently
        }
    };

    return {
        createOpen,
        editOpen,
        deleteOpen,
        setCreateOpen,
        setEditOpen,
        setDeleteOpen,
        handleKebabMenuOption,
    };
};

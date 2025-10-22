import React from "react";
import { GridAlignment, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { red } from "@mui/material/colors";

// MUI ICONS
import CategoryIcon from '@mui/icons-material/Category';
import ReportIcon from '@mui/icons-material/Report';

// UTILS, TYPES
import { useKebabMenuOptions } from "@/Reuseable/utils/kebabActionMenu/useKebabMenuOptions";
import { formatDate } from "@/Reuseable/utils/formatDate";
import { SystemCategory } from "@/Reuseable/types/system-categories.types";

// COMPONENTS
import MaintenanceStatusChip from "@/Pages/Maintenance/Components/MaintenanceStatusChip";
import KebabMenu from "@/Components/Mui/KebabMenu";

// USE SYSTEM CATEGORIES COLUMNS
export const SystemCategoriesColumns = (
    onKebabMenuSelect: (option: string | { text: string }, row: any, closeMenu: () => void) => void
) => {

    // SYSTEM CATEGORIES DATA GRID COLUMNS
    const columns: GridColDef[] = [
        {
            field: "created_at",
            headerName: "DATE ADDED",
            minWidth: 220,
            filterable: true,
            sortable: false,
            disableColumnMenu: true,
            renderCell: ({ row }) => <span>{formatDate(row.created_at)}</span>,
        },
        {
            field: "category_name",
            headerName: "CATEGORY NAME",
            minWidth: 400,
            flex: 1,
            filterable: true,
            sortable: false,
            disableColumnMenu: true,
            renderCell: ({ row }: { row: SystemCategory }) => (
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <CategoryIcon color="primary" sx={{ flexShrink: 0 }} />
                    <span style={{ 
                        overflow: "hidden", 
                        textOverflow: "ellipsis", 
                        whiteSpace: "nowrap",
                        minWidth: 0,
                        flex: 1
                    }}>
                        {row.category_name}
                    </span>
                </div>
            ),
        },
        {
            field: "status",
            headerName: "STATUS",
            width: 180,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <MaintenanceStatusChip status={params.value} />
            ),
        },
        {
            field: "action",
            headerName: "ACTION",
            headerAlign: "center" as GridAlignment,
            align: "center" as GridAlignment,
            minWidth: 150,
            filterable: true,
            sortable: false,
            disableColumnMenu: true,
            renderCell: ({ row }: { row: SystemCategory }) => {
                const { kebabMenuOptions: filteredOptions } = useKebabMenuOptions(row.status);
                return (
                    <KebabMenu
                        options={filteredOptions as (string | { text: string; color?: 'primary' | 'error' | 'info' | 'success' | 'warning' | 'secondary' })[]}
                        onSelect={(option, closeMenu) => onKebabMenuSelect(option, row, closeMenu)}
                    />
                );
            },
        },
    ];

    return columns;
};
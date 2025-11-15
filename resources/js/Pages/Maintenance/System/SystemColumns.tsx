import React from "react";
import { GridAlignment, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { red } from "@mui/material/colors";

// MUI ICONS
import DevicesIcon from '@mui/icons-material/Devices';
import ReportIcon from '@mui/icons-material/Report';

// UTILS, TYPES
import { useKebabMenuOptions } from "@/Reuseable/utils/kebabActionMenu/useKebabMenuOptions";
import { formatDate } from "@/Reuseable/utils/formatDate";
import { SystemResponse } from "@/Reuseable/types/system.types";

// COMPONENTS
import MaintenanceStatusChip from "@/Pages/Maintenance/Components/MaintenanceStatusChip";
import KebabMenu from "@/Components/Mui/KebabMenu";

// USE SYSTEM COLUMNS
export const SystemColumns = (
    onKebabMenuSelect: (option: string | { text: string }, row: any, closeMenu: () => void) => void,
    onRowClick?: (row: any) => void
) => {

    // COMPANIES DATA GRID COLUMNS
    const columns: GridColDef[] = [
        {
            field: "created_at",
            headerName: "DATE ADDED",
            minWidth: 200,
            flex: 1,
            filterable: true,
            sortable: false,
            disableColumnMenu: true,
            renderCell: ({ row }) => (
                <span 
                    onClick={() => onRowClick?.(row)}
                    style={{ cursor: "pointer", width: "100%", display: "block" }}
                >
                    {formatDate(row.created_at)}
                </span>
            ),
        },
        {
            field: "system_name",
            headerName: "SYSTEM NAME",
            minWidth: 350,
            flex: 1,
            filterable: true,
            sortable: false,
            disableColumnMenu: true,
            renderCell: ({ row }: { row: SystemResponse }) => (
                <div 
                    onClick={() => onRowClick?.(row)}
                    style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 10, 
                        minWidth: 0,
                        cursor: "pointer",
                        width: "100%"
                    }}
                >
                    <DevicesIcon color="primary" sx={{ flexShrink: 0 }} />
                    <span style={{ 
                        overflow: "hidden", 
                        textOverflow: "ellipsis", 
                        whiteSpace: "nowrap",
                        minWidth: 0,
                        flex: 1
                    }}>
                        {row.system_name}
                    </span>
                </div>
            ),
        },
        {
            field: "category",
            headerName: "PROBLEM ENCOUNTERED",
            minWidth: 400,
            flex: 1,
            filterable: true,
            sortable: false,
            disableColumnMenu: true,
            renderCell: ({ row }: { row: SystemResponse }) => {
                const categoriesText = row.category && row.category.length > 0 
                    ? row.category.map(cat => cat.category_name).join(", ")
                    : "No categories";

                return (
                    <Box 
                        onClick={() => onRowClick?.(row)}
                        sx={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: 1, 
                            width: "100%", 
                            minWidth: 0,
                            cursor: "pointer"
                        }}
                    >
                        <ReportIcon sx={{ color: red[500], flexShrink: 0 }} />
                        <span style={{ 
                            overflow: "hidden", 
                            textOverflow: "ellipsis", 
                            whiteSpace: "nowrap",
                            minWidth: 0,
                            flex: 1
                        }}>
                            {categoriesText}
                        </span>
                    </Box>
                );
            },
        },
        {
            field: "status",
            headerName: "STATUS",
            minWidth: 100,
            flex: 1,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <div 
                    onClick={() => onRowClick?.(params.row)}
                    style={{ cursor: "pointer", width: "100%", display: "flex", justifyContent: "center" }}
                >
                    <MaintenanceStatusChip status={params.value} />
                </div>
            ),
        },
        {
            field: "action",
            headerName: "ACTION",
            headerAlign: "center" as GridAlignment,
            align: "center" as GridAlignment,
            minWidth: 100,
            flex: 1,
            filterable: true,
            sortable: false,
            disableColumnMenu: true,
            renderCell: ({ row }: { row: SystemResponse }) => {
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
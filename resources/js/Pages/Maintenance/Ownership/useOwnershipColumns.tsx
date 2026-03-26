import { GridAlignment, GridColDef } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import KebabMenu from "@/Components/Mui/KebabMenu";
import { formatDate } from "@/Reuseable/utils/formatDate";
import { OwnershipResponse } from "@/Reuseable/types/ownershipTypes";
import MaintenanceStatusChip from "@/Pages/Maintenance/Components/MaintenanceStatusChip";
import { useKebabMenuOptions } from "@/Reuseable/utils/kebabActionMenu/useKebabMenuOptions";

export const useOwnershipColumns = (
    onKebabMenuSelect: (option: string | { text: string }, row: any, closeMenu: () => void) => void
) => {
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
            field: "ownership_name",
            headerName: "OWNERSHIP",
            flex: 1,
            minWidth: 250,
            filterable: true,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <Box display="flex" alignItems="center" gap={1} height="100%">
                    <BusinessCenterOutlinedIcon color="primary" />
                    <Typography>{params.value}</Typography>
                </Box>
            ),
        },
        {
            field: "status",
            headerName: "STATUS",
            width: 180,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    <MaintenanceStatusChip status={params.value} />
                </div>
            ),
        },
        {
            field: "action",
            headerName: "ACTION",
            headerAlign: "center" as GridAlignment,
            align: "center" as GridAlignment,
            minWidth: 150,
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            renderCell: ({ row }: { row: OwnershipResponse }) => {
                const { kebabMenuOptions: filteredOptions } = useKebabMenuOptions(row.status);
                return (
                    <KebabMenu
                        options={
                            filteredOptions as (
                                | string
                                | { text: string; color?: "primary" | "error" | "info" | "success" | "warning" | "secondary" }
                            )[]
                        }
                        onSelect={(option, closeMenu) => onKebabMenuSelect(option, row, closeMenu)}
                    />
                );
            },
        },
    ];

    return columns;
};

import { GridAlignment, GridColDef } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import KebabMenu from "@/Components/Mui/KebabMenu";
import { formatDate } from "@/Reuseable/utils/formatDate";
import { StoreTypeResponse } from "@/Reuseable/types/storeTypeTypes";
import MaintenanceStatusChip from "@/Pages/Maintenance/Components/MaintenanceStatusChip";
import { useKebabMenuOptions } from "@/Reuseable/utils/kebabActionMenu/useKebabMenuOptions";

export const useStoreTypeColumns = (
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
            field: "store_type_name",
            headerName: "STORE TYPE",
            flex: 1,
            minWidth: 250,
            filterable: true,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <Box display="flex" alignItems="center" gap={1} height="100%">
                    <CategoryOutlinedIcon color="primary" />
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
            renderCell: ({ row }: { row: StoreTypeResponse }) => {
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

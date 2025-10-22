import { GridAlignment, GridColDef } from "@mui/x-data-grid";
import { formatDate } from "@/Reuseable/utils/formatDate";
import KebabMenu from "@/Components/Mui/KebabMenu";
import { useKebabMenuOptions } from "@/Reuseable/utils/kebabActionMenu/useKebabMenuOptions";
import { ServiceCenterResponse } from "@/Reuseable/types/service-center.types";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { red } from "@mui/material/colors";
import MaintenanceStatusChip from "@/Pages/Maintenance/Components/MaintenanceStatusChip";

// USE SERVICE CENTER COLUMNS
export const ServiceCenterColumns = (
    onKebabMenuSelect: (option: string | { text: string }, row: any, closeMenu: () => void) => void
) => {

    // COMPANIES DATA GRID COLUMNS
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
            field: "service_center_name",
            headerName: "SERVICE CENTER NAME",
            flex: 1,
            minWidth: 250,
            filterable: true,
            sortable: false,
            disableColumnMenu: true,
            renderCell: ({ row }: { row: ServiceCenterResponse }) => (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <LocationOnIcon sx={{ color: red[500] }} />
                    <span>{row.service_center_name}</span>
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
                <div 
                    style={{ width: "100%", display: "flex", justifyContent: "center" }}
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
            minWidth: 150,
            filterable: true,
            sortable: false,
            disableColumnMenu: true,
            renderCell: ({ row }: { row: ServiceCenterResponse }) => {
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
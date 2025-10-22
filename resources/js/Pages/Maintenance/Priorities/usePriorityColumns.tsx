import { GridAlignment, GridColDef } from "@mui/x-data-grid";
import { formatDate } from "@/Reuseable/utils/formatDate";
import KebabMenu from "@/Components/Mui/KebabMenu";
import { useKebabMenuOptions } from "@/Reuseable/utils/kebabActionMenu/useKebabMenuOptions";
import { Typography, Box } from "@mui/material";
import PriorityChip from "@/Pages/Tickets/TicketComponents/PriorityChip";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { PriorityResponse } from "@/Reuseable/types/priorityTypes";
import MaintenanceStatusChip from "@/Pages/Maintenance/Components/MaintenanceStatusChip";


// USE PRIORITY COLUMNS
export const usePriorityColumns = (
    onKebabMenuSelect: (option: string | { text: string }, row: any, closeMenu: () => void) => void
) => {

    const columns: GridColDef[] = [
        {
            field: "created_at",
            headerName: "DATE ADDED",
            minWidth: 220,
            filterable: true,
            renderCell: ({ row }) => <span>{formatDate(row.created_at)}</span>,
        },
        {
            field: "priority_name",
            headerName: "PRIORITY NAME",
            minWidth: 250,
            filterable: true,
            renderCell: (params) => {
                const priorityName = params.row.priority_name || "Not Priority";
                return <PriorityChip label={priorityName} priority={priorityName.toLowerCase()} />;
            },
        },
        {
            field: "description",
            headerName: "DESCRIPTION",
            flex: 1,
            minWidth: 250,
            filterable: true,
            renderCell: (params) => (
                <Box display="flex" alignItems="center" gap={1} height="100%">
                    <DescriptionOutlinedIcon color="primary" />
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
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: "center" as GridAlignment,
            align: "center" as GridAlignment,
            minWidth: 150,
            renderCell: ({ row }: { row: PriorityResponse }) => {
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
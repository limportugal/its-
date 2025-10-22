import { GridAlignment, GridColDef } from "@mui/x-data-grid";
import { formatDate } from "@/Reuseable/utils/formatDate";
import KebabMenu from "@/Components/Mui/KebabMenu";
import { useKebabMenuOptions } from "@/Reuseable/utils/kebabActionMenu/useKebabMenuOptions";
import { CompanyResponse } from "@/Reuseable/types/companyTypes";
import CompanyIcon from "@/Pages/Maintenance/Companies/Logo";
import MaintenanceStatusChip from "@/Pages/Maintenance/Components/MaintenanceStatusChip";

// USE COMPANY COLUMNS
export const useCompanyColumns = (
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
            field: "company_name",
            headerName: "COMPANY NAME",
            flex: 1,
            minWidth: 250,
            filterable: true,
            sortable: false,
            disableColumnMenu: true,
            renderCell: ({ row }: { row: CompanyResponse }) => (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <CompanyIcon companyName={row.company_name} />
                    <span>{row.company_name}</span>
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
            renderCell: ({ row }: { row: CompanyResponse }) => {
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
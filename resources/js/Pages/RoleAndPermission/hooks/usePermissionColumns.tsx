import { GridAlignment, GridColDef } from "@mui/x-data-grid";
import { formatDate } from "@/Reuseable/utils/formatDate";
import RoleChips from "@/Components/Mui/RoleChips";
import KebabMenu from "@/Components/Mui/KebabMenu";
import { useKebabMenuOptions } from "@/Reuseable/utils/kebabActionMenu/useKebabMenuOptions";
import { PermissionsResponse } from "@/Reuseable/types/rolesAndPermissions/permissionTypes";
import PermissionChip from '@/Components/Mui/PermissionChip';
import { snakeCaseToTitleCase } from '@/Reuseable/utils/capitalize';

// USE PERMISSION COLUMNS
export const usePermissionColumns = (
    onKebabMenuSelect: (option: string | { text: string }, row: any, closeMenu: () => void) => void
) => {

    // KEBAB MENU OPTIONS
    const { kebabMenuOptions } = useKebabMenuOptions();

    // PERMISSION COLUMNS
    const columns: GridColDef[] = [
        {
            field: "created_at",
            headerName: "DATE ADDED",
            width: 220,
            filterable: true,
            sortable: false,
            disableColumnMenu: true,
            renderCell: ({ row }) => <span>{formatDate(row.created_at)}</span>,
        },
        {
            field: "name",
            headerName: "PERMISSION NAME",
            minWidth: 250,
            filterable: true,
            renderCell: (params) => {
                return params.row.name ? <PermissionChip name={snakeCaseToTitleCase(params.row.name)} /> : null;
            }
        },
        {
            field: "roles",
            headerName: "ASSIGNED ROLES",
            flex: 1,
            minWidth: 250,
            filterable: true,
            renderCell: (params) => {
                return params.row.roles && params.row.roles.length > 0 ?
                    <RoleChips roles={params.row.roles} /> : null;
            }
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
            renderCell: ({ row }: { row: PermissionsResponse }) => {
                return (
                    <KebabMenu
                        options={kebabMenuOptions as (string | { text: string; color?: 'primary' | 'error' | 'info' | 'success' | 'warning' | 'secondary' })[]}
                        onSelect={(option, closeMenu) => onKebabMenuSelect(option, row, closeMenu)}
                    />
                );
            },
        },
    ];

    return columns;
}; 
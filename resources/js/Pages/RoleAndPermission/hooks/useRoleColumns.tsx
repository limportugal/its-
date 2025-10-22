import { GridAlignment, GridColDef } from "@mui/x-data-grid";
import { RolesResponse } from "@/Reuseable/types/rolesAndPermissions/roleTypes";
import { formatDate } from "@/Reuseable/utils/formatDate";
import RoleChips from "@/Components/Mui/RoleChips";
import KebabMenu from "@/Components/Mui/KebabMenu";
import { useKebabMenuOptions } from "@/Reuseable/utils/kebabActionMenu/useKebabMenuOptions";

export const useRoleColumns = (
    userPermissions: string[],
    userRoles: string[],
    onKebabMenuSelect: (option: string | { text: string }, row: any, closeMenu: () => void) => void
) => {
    const { kebabMenuOptions } = useKebabMenuOptions();

    // ROLE COLUMNS
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
            headerName: "ROLE NAME",
            minWidth: 250,
            filterable: true,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params) => {
                return params.row.name ? <RoleChips roles={[{ name: params.row.name }]} /> : null;
            }
        },
        {
            field: "description",
            headerName: "DESCRIPTION",
            flex: 1,
            minWidth: 300,
            filterable: true,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <span
                    style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'block',
                        width: '100%'
                    }}
                    title={params.value}
                >
                    {params.value}
                </span>
            ),
        },
        {
            field: "action",
            headerName: "ACTION",
            headerAlign: "center" as GridAlignment,
            align: "center" as GridAlignment,
            minWidth: 150,
            sortable: false,
            disableColumnMenu: true,
            renderCell: ({ row }: { row: RolesResponse }) => {
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
import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useMediaQuery, useTheme } from "@mui/material";
import { RolesResponse } from "@/Reuseable/types/rolesAndPermissions/roleTypes";
import { dataGridHeaderStyles } from "@/Reuseable/hooks/useDataGridHeaderStyles";
import { useRoleColumns } from "@/Pages/RoleAndPermission/hooks/useRoleColumns";
import CustomToolbar from "@/Components/Mui/CustomToolbar";
interface RolesDataGridProps {
    roleData: RolesResponse[] | undefined;
    isPendingCreateRole: boolean;
    onKebabMenuSelect: (
        option: string | { text: string },
        row: any,
        closeMenu: () => void
    ) => void;
    userPermissions?: string[];
    userRoles?: string[];
    handleOpen: () => void;
}

const RolesDataGrid: React.FC<RolesDataGridProps> = ({
    roleData,
    isPendingCreateRole,
    onKebabMenuSelect,
    userPermissions = [],
    userRoles = [],
    handleOpen,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const columns = useRoleColumns(
        userPermissions,
        userRoles,
        onKebabMenuSelect
    );

    return (
        <DataGrid
            rows={roleData || []}
            columns={columns}
            getRowId={(row) => row.id}
            disableColumnResize
            rowHeight={60}
            loading={isPendingCreateRole}
            sx={{
                ...dataGridHeaderStyles(theme),
                border: "none",
                mx: -1,
            }}
            pageSizeOptions={[10, 20, 50, 100]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            showToolbar
            slots={{
                toolbar: () => (
                    <CustomToolbar
                        showAddButton={true}
                        onAddClick={handleOpen}
                        addTooltipText="Create Role"
                        showExport={false}
                        showColumns={false}
                        showFilter={isMobile ? false : true}
                        showDensity={isMobile ? false : true}
                        showQuickFilter={true}
                    />
                ),
            }}
        />
    );
};

export default RolesDataGrid;

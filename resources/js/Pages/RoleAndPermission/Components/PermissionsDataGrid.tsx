import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { dataGridHeaderStyles } from "@/Reuseable/hooks/useDataGridHeaderStyles";
import { usePermissionColumns } from "@/Pages/RoleAndPermission/hooks/usePermissionColumns";
import { PermissionsResponse } from "@/Reuseable/types/rolesAndPermissions/permissionTypes";
import CustomToolbar from "@/Components/Mui/CustomToolbar";
import { useMediaQuery, useTheme } from "@mui/material";
interface PermissionsDataGridProps {
    permissionData: PermissionsResponse[] | undefined;
    isPendingPermissions: boolean;
    onKebabMenuSelect: (
        option: string | { text: string },
        row: any,
        closeMenu: () => void
    ) => void;
    userRoles?: string[];
    handleOpen: () => void;
}

const PermissionsDataGrid: React.FC<PermissionsDataGridProps> = ({
    permissionData,
    isPendingPermissions,
    onKebabMenuSelect,
    userRoles = [],
    handleOpen,
}): React.ReactElement => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const columns = usePermissionColumns(onKebabMenuSelect);

    // FILTER PERMISSIONS
    const filteredPermissions = permissionData?.filter((perm) =>
        isNaN(Number(perm.name))
    );

    // RENDER PERMISSIONS DATA GRID
    return (
        <DataGrid
            rows={filteredPermissions || []}
            columns={columns}
            getRowId={(row) => row.id}
            disableColumnResize
            rowHeight={60}
            loading={isPendingPermissions}
            sx={{
                ...dataGridHeaderStyles(theme),
                border: "none",
                mx: -1,
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            showToolbar
            slots={{
                toolbar: () => (
                    <CustomToolbar
                        showAddButton={true}
                        onAddClick={handleOpen}
                        addTooltipText="Create Permission"
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

export default PermissionsDataGrid;

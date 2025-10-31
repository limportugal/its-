import React, { startTransition } from "react";
import { Head } from "@inertiajs/react";

// MUI COMPONENTS
import { DataGrid, GridFilterModel, GridLogicOperator } from "@mui/x-data-grid";
import { Typography, useMediaQuery, useTheme } from "@mui/material";

// USER LOGS COMPONENTS
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

// HOOKS, TYPE, HELPERS & UTILS
import { dataGridHeaderStyles } from "@/Reuseable/hooks/useDataGridHeaderStyles";
import { fetchingErrorAlert } from "@/Reuseable/helpers/fetchErrorAlert";
import { fetchUserLogsData } from "@/Reuseable/api/User/userLogApi";

// TANSTACK USEQUERY HOOK & INERTIA ROUTER
import { router } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import { UserLogsColumns } from "@/Pages/UserLogs/UserLogsColumns";
import { UserLogsResponse } from "@/Reuseable/types/userLogsTypes";
import ViewUserLogs from "@/Pages/UserLogs/ViewUserLogs";
import useUserLogsStore from "@/stores/useUserLogsStore";
import UserLogsNoRowsOverlay from "@/Pages/UserLogs/UserLogsNoRowsOverlay";

const IndexUserLogs = (): React.ReactElement => {
    const { openDialog, selectedLog, setOpenDialog, setSelectedLog } = useUserLogsStore();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // GET URL PARAMETERS
    const urlParams = new URLSearchParams(window.location.search);
    const urlPage = parseInt(urlParams.get('page') || '1') - 1; // Convert to 0-based index
    const urlPageSize = parseInt(urlParams.get('pageSize') || '10');
    const urlSearch = urlParams.get('search') || '';

    const [filterModel, setFilterModel] = React.useState<GridFilterModel>(() => {
        // Initialize filter model with URL search parameter
        if (urlSearch) {
            return {
                items: [],
                quickFilterValues: [urlSearch],
                quickFilterLogicOperator: GridLogicOperator.And
            };
        }
        return { items: [] };
    });
    const [debouncedFilterModel, setDebouncedFilterModel] = React.useState<GridFilterModel>(() => {
        // Initialize debounced filter model with URL search parameter
        if (urlSearch) {
            return {
                items: [],
                quickFilterValues: [urlSearch],
                quickFilterLogicOperator: GridLogicOperator.And
            };
        }
        return { items: [] };
    });
    const [paginationModel, setPaginationModel] = React.useState({
        page: urlPage,
        pageSize: urlPageSize,
    });
    const [sortModel, setSortModel] = React.useState<any[]>([]);
    const [isFilterChanging, setIsFilterChanging] = React.useState(false);

    // DEBOUNCE FILTER CHANGES (BUT NOT PAGINATION) - OPTIMIZED
    React.useEffect(() => {
        setIsFilterChanging(true);
        
        const timeoutId = setTimeout(() => {
            startTransition(() => {
                setDebouncedFilterModel(filterModel);
                setIsFilterChanging(false);
            });
        }, 300); // Further reduced debounce time for better responsiveness

        return () => {
            clearTimeout(timeoutId);
        };
    }, [filterModel]);

    // SYNC PAGINATION MODEL WITH URL ON INITIAL LOAD
    React.useEffect(() => {
        // Sync pagination with URL on initial load only
        if (urlPage !== paginationModel.page) {
            setPaginationModel(prev => ({ ...prev, page: urlPage }));
        }
    }, []);

    // Update URL when pagination changes
    const updateURL = React.useCallback((newPaginationModel: any, newFilterModel: any = filterModel) => {
        const params = new URLSearchParams();
        
        // Convert page from 0-based to 1-based
        params.set('page', (newPaginationModel.page + 1).toString());
        params.set('pageSize', newPaginationModel.pageSize.toString());
        
        // Add search if exists
        const searchValue = (newFilterModel as any).quickFilterValues?.join(' ') || '';
        if (searchValue) {
            params.set('search', searchValue);
        }
        
        // Update URL without page reload
        const newURL = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({}, '', newURL);
    }, [filterModel]);

    // TANSTACK USEQUERY TO FETCH USER LOGS - PERFORMANCE OPTIMIZED
    const {
        data: userLogsResponse,
        isError: isErrorUserLogs,
        isPending: isPendingUserLogs,
    } = useQuery<{data: UserLogsResponse[], totalCount: number, page: number, pageSize: number}>({
        queryKey: ["getUserLogsData", debouncedFilterModel, paginationModel, sortModel],
        queryFn: React.useCallback(() => {
            const queryOptions = { 
                filterModel: debouncedFilterModel,
                paginationModel,
                sortModel,
                quickFilterText: (debouncedFilterModel as any).quickFilterValues?.join(' ') || ''
            };
            
            
            return fetchUserLogsData(queryOptions);
        }, [debouncedFilterModel, paginationModel, sortModel]),
        staleTime: 1000 * 60 * 30, // 30 minutes for ultra-fast caching
        gcTime: 1000 * 60 * 60, // 1 hour garbage collection time
        refetchOnWindowFocus: false,
        refetchInterval: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: 1, // Reduce retry attempts
        retryDelay: 1000, // Delay between retries
        // Add request cancellation
        networkMode: 'online',
        // Prevent multiple simultaneous requests
        enabled: true,
    });

    const userLogs = userLogsResponse?.data || [];
    const totalCount = userLogsResponse?.totalCount || 0;

    // Handle loading and errors
    if (isErrorUserLogs) { 
        fetchingErrorAlert(); 
        return <></>; 
    }

    // Handle cell click - OPTIMIZED WITH STARTTRANSITION AND DEBOUNCING
    const handleCellClick = React.useCallback((params: { row: UserLogsResponse }) => {
        // Use startTransition to mark state updates as non-urgent
        startTransition(() => {
            setSelectedLog(params.row);
            setOpenDialog(true);
        });
    }, [setSelectedLog, setOpenDialog]);

    const handleOpenDialog = React.useCallback((log: UserLogsResponse) => { 
        startTransition(() => {
            setSelectedLog(log); 
            setOpenDialog(true); 
        });
    }, [setSelectedLog, setOpenDialog]);
    
    const handleCloseDialog = React.useCallback(() => { 
        startTransition(() => {
            setOpenDialog(false); 
            setSelectedLog(null); 
        });
    }, [setOpenDialog, setSelectedLog]);

    const onFilterChange = React.useCallback((newFilterModel: GridFilterModel) => {
        startTransition(() => {
            setFilterModel(newFilterModel);
            // Reset pagination to page 0 when filter changes
            const newPaginationModel = { page: 0, pageSize: paginationModel.pageSize };
            setPaginationModel(newPaginationModel);
            updateURL(newPaginationModel, newFilterModel);
        });
    }, [paginationModel.pageSize, updateURL]);

    const onPaginationModelChange = React.useCallback((newPaginationModel: any) => {
        startTransition(() => {
            setPaginationModel(newPaginationModel);
            updateURL(newPaginationModel);
        });
    }, [updateURL]);

    const onSortModelChange = React.useCallback((newSortModel: any) => {
        startTransition(() => {
            setSortModel([...newSortModel]);
        });
    }, []);
    
    // GET THE COLUMNS - MEMOIZED FOR PERFORMANCE
    const columns = React.useMemo(() => UserLogsColumns(), []);

    // RENDERING USER LOGS DATA GRID
    return (
        <AuthenticatedLayout header={<Typography variant="h6" />}>
            <Head title="User Logs" />
            <DataGrid
                key={`datagrid-${paginationModel.page}-${paginationModel.pageSize}`} // Only re-render on pagination change
                rows={userLogs}
                columns={columns}
                disableColumnResize
                filterMode="server"
                sortingMode="server"
                paginationMode="server"
                onFilterModelChange={onFilterChange}
                onSortModelChange={onSortModelChange}
                onPaginationModelChange={onPaginationModelChange}
                getRowId={(row) => row.id}
                onCellClick={handleCellClick}
                rowHeight={60}
                loading={isPendingUserLogs || isFilterChanging}
                sx={{
                    ...dataGridHeaderStyles(theme),
                    cursor: "pointer",
                    borderRadius: 2,
                    mt: isMobile ? -2 : 1.5,
                    mx: isMobile ? -1 : 0,
                }}
                showToolbar
                pageSizeOptions={[10,25, 50, 75, 100]}
                paginationModel={paginationModel}
                sortModel={sortModel}
                rowCount={totalCount}
                disableColumnFilter
                slots={{
                    noRowsOverlay: UserLogsNoRowsOverlay,
                }}
                // PERFORMANCE OPTIMIZATIONS
                disableVirtualization={false}
                disableRowSelectionOnClick={true}
                disableMultipleRowSelection={true}
                hideFooterSelectedRowCount={true}
                disableColumnMenu={true}
            />
            {/* VIEW USER LOGS DIALOG */}
            <ViewUserLogs open={openDialog} onClose={handleCloseDialog} userLog={selectedLog} />
        </AuthenticatedLayout>
    );
};

export default IndexUserLogs;

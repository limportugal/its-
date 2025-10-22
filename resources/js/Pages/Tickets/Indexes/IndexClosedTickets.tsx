import React, { startTransition } from "react";
import { Head } from "@inertiajs/react";

// MUI COMPONENTS
import { DataGrid, GridFilterModel, GridLogicOperator } from "@mui/x-data-grid";
import { Typography, useMediaQuery, useTheme } from "@mui/material";

// TICKET COMPONENTS
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

// HOOKS, TYPE, HELPERS & UTILS
import { dataGridHeaderStyles } from "@/Reuseable/hooks/useDataGridHeaderStyles";
import { fetchingErrorAlert } from "@/Reuseable/helpers/fetchErrorAlert";
import { fetchClosedTicketsData } from "@/Reuseable/api/ticket/close-ticket/closed-tickets-api";

// TANSTACK USEQUERY HOOK &  INERTIA ROUTER
import { router } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import closedTicketColumns from "@/Pages/Tickets/Columns/ClosedTicketsColumns";
import { ClosedTicketsResponse } from "@/Reuseable/types/ticket/closed-tickets.types";
import ClosedNoRowsOverlay from "@/Pages/Tickets/TicketComponents/ClosedNoRowsOverlay";

const IndexClosedTickets = (): React.ReactElement => {
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
        }, 300); // Optimized debounce time

        return () => clearTimeout(timeoutId);
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

    // REMOVED: Old debounced filter update that was causing pagination issues


    // TANSTACK USEQUERY TO FETCH CLOSED TICKETS - PERFORMANCE OPTIMIZED
    const {
        data: closedTicketsResponse,
        isError: isErrorClosedTickets,
        isPending: isPendingClosedTickets,
    } = useQuery<{data: ClosedTicketsResponse[], totalCount: number, page: number, pageSize: number}>({
        queryKey: ["getClosedTickets", debouncedFilterModel, paginationModel, sortModel],
        queryFn: React.useCallback(() => {
            const queryOptions = { 
                filterModel: debouncedFilterModel,
                paginationModel,
                sortModel,
                quickFilterText: (debouncedFilterModel as any).quickFilterValues?.join(' ') || ''
            };
            return fetchClosedTicketsData(queryOptions);
        }, [debouncedFilterModel, paginationModel, sortModel]),
        staleTime: 1000 * 60 * 30, // 30 minutes for ultra-fast caching
        gcTime: 1000 * 60 * 60, // 1 hour garbage collection time
        refetchOnWindowFocus: false,
        refetchInterval: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: 1, // Reduce retry attempts
        retryDelay: 1000, // Delay between retries
        networkMode: 'online',
        enabled: true,
    });

    const closedTickets = closedTicketsResponse?.data || [];
    const totalCount = closedTicketsResponse?.totalCount || 0;

    // Handle loading and errors
    if (isErrorClosedTickets) { fetchingErrorAlert(); return <></>; }

    // Handle cell click - OPTIMIZED WITH STARTTRANSITION
    const handleCellClick = React.useCallback((params: { row: ClosedTicketsResponse }) => {
        startTransition(() => {
            router.visit(route('tickets.viewClosedTicketByUuid', {
                uuid: params.row.uuid,
            }), {
                replace: true,
                preserveScroll: false,
                preserveState: false,
                only: [],
            });
        });
    }, []);

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
    const columns = React.useMemo(() => closedTicketColumns, []);

    // RENDERING TICKETS DATA GRID
    return (
        <AuthenticatedLayout header={<Typography variant="h6" />}>
            <Head title="Tickets" />
            {isFilterChanging && (
                <div style={{
                    position: 'fixed',
                    top: '10px',
                    right: '10px',
                    background: '#1976d2',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    zIndex: 9999,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                    🔍 Filtering data...
                </div>
            )}
            <DataGrid
                key={`datagrid-${paginationModel.page}-${paginationModel.pageSize}`} // Only re-render on pagination change
                rows={closedTickets}
                columns={columns}
                disableColumnResize
                filterMode="server"
                sortingMode="server"
                paginationMode="server"
                onFilterModelChange={onFilterChange}
                onSortModelChange={onSortModelChange}
                onPaginationModelChange={onPaginationModelChange}
                getRowId={(row) => row.ticket_number}
                onCellClick={handleCellClick}
                rowHeight={60}
                loading={isPendingClosedTickets || isFilterChanging}
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
                    noRowsOverlay: ClosedNoRowsOverlay,
                }}
                // PERFORMANCE OPTIMIZATIONS
                disableVirtualization={false}
                disableRowSelectionOnClick={true}
                disableMultipleRowSelection={true}
                hideFooterSelectedRowCount={true}
                disableColumnMenu={true}
            />
        </AuthenticatedLayout>
    );
};

export default IndexClosedTickets;

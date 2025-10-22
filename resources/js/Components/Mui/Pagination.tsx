import {
    useGridApiContext,
    useGridSelector,
    gridPageSelector,
    gridPageCountSelector,
    gridPageSizeSelector,
    gridRowCountSelector,
    GridFooterContainer,
} from '@mui/x-data-grid';
import { Pagination, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';

const ReuseablePagination = () => {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);
    const pageSize = useGridSelector(apiRef, gridPageSizeSelector);
    const rowCount = useGridSelector(apiRef, gridRowCountSelector);

    // Calculate from, to, count
    const from = rowCount === 0 ? 0 : page * pageSize + 1;
    const to = Math.min((page + 1) * pageSize, rowCount);

    return (
        <GridFooterContainer>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', justifyContent: 'center' }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Rows per page</InputLabel>
                    <Select
                        value={pageSize}
                        label="Rows per page"
                        onChange={(e) => apiRef.current.setPageSize(Number(e.target.value))}
                    >
                        {[5, 10, 20, 50, 100].map((size) => (
                            <MenuItem key={size} value={size}>
                                {size}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {/* Row count display */}
                <span>
                    {from}-{to} of {rowCount}
                </span>
                <Pagination
                    color="primary"
                    shape="rounded"
                    count={pageCount}
                    page={page + 1}
                    onChange={(_, value) => apiRef.current.setPage(value - 1)}
                    showFirstButton
                    showLastButton
                    sx={{
                        '& .MuiPaginationItem-root': {
                            borderRadius: 8,
                        },
                    }}
                />
            </Box>
        </GridFooterContainer>
    );
};

export default ReuseablePagination;

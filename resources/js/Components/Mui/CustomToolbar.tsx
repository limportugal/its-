import { IconButton, Tooltip, useTheme, useMediaQuery } from "@mui/material";
import { GridToolbarContainer, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarQuickFilter, GridToolbarColumnsButton, GridToolbarExport } from "@mui/x-data-grid";
import AddIcon from '@mui/icons-material/Add';
import { blue } from "@mui/material/colors";

interface CustomToolbarProps {
    onAddClick?: () => void;
    addTooltipText?: string;
    showAddButton?: boolean;
    showExport?: boolean;
    showColumns?: boolean;
    showFilter?: boolean;
    showDensity?: boolean;
    showQuickFilter?: boolean;
}

const CustomToolbar = ({
    onAddClick,
    addTooltipText = "Add New",
    showAddButton = true,
    showExport = true,
    showColumns = true,
    showFilter = true,
    showDensity = true,
    showQuickFilter = true
}: CustomToolbarProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    return (
        <GridToolbarContainer>
            {showExport && <GridToolbarExport />}
            {showColumns && <GridToolbarColumnsButton />}
            {showFilter && <GridToolbarFilterButton />}
            {showDensity && <GridToolbarDensitySelector />}
            {showQuickFilter && <GridToolbarQuickFilter />}
            {showAddButton && (
                <Tooltip title={addTooltipText} arrow>
                    <IconButton
                        color="primary"
                        size={isMobile ? "small" : "medium"}
                        onClick={() => { if (onAddClick) onAddClick(); }}
                        sx={{
                            m: { xs: 0.2, sm: 0.3 },
                            mr: { xs: 0.5, sm: 1 },
                            width: 34,
                            height: 34,
                            '&:hover': {
                                backgroundColor: blue[50],
                                width: 34,
                                height: 34,
                            }
                        }}
                    >
                        <AddIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                    </IconButton>
                </Tooltip>
            )}
        </GridToolbarContainer>
    );
};

export default CustomToolbar;

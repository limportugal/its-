import { alpha, Theme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

export const dataGridHeaderStyles = (theme: Theme, withPointer?: boolean) => ({
    "& .MuiDataGrid-cell": {
        border: (theme: Theme) => `1px solid ${alpha(theme.palette.text.primary, 0.04)}`,
        '&:focus': {
            outline: 'none'
        },
        '&:focus-within': {
            outline: 'none'
        },
    },
    "& .MuiDataGrid-columnHeaders": {
        background: theme.palette.mode === "dark" 
            ? `linear-gradient(135deg, ${grey[900]} 0%, ${grey[800]} 100%)`
            : `linear-gradient(135deg, ${grey[50]} 0%, ${grey[100]} 100%)`,
        minHeight: '56px !important',
        maxHeight: '56px !important',
        '& .MuiDataGrid-columnHeader': {
            background: theme.palette.mode === "dark" 
                ? `linear-gradient(135deg, ${grey[900]} 0%, ${grey[800]} 100%)`
                : `linear-gradient(135deg, ${grey[50]} 0%, ${grey[100]} 100%)`,
            '&:focus': {
                outline: 'none'
            },
            '&:focus-within': {
                outline: 'none'
            }
        }
    },
    "& .MuiDataGrid-columnHeaderTitle": {
        fontWeight: "500",
        textAlign: "center",
        width: "100%",
        letterSpacing: '0.01em',
        textTransform: 'none',
        color: theme.palette.text.secondary,
        padding: '0 8px',
        whiteSpace: 'normal',
        wordWrap: 'break-word',
        overflowWrap: 'break-word'
    },
    "& .MuiDataGrid-columnSeparator": {
        visibility: "visible",
        opacity: 0.5
    },
    ...(withPointer && {
        "& .MuiDataGrid-row": {
            cursor: "pointer",
        },
    }),
});

// Create a version that works without theme parameter for backward compatibility
export const dataGridHeaderStylesSimple = (withPointer?: boolean) => ({
    "& .MuiDataGrid-cell": {
        border: `1px solid rgba(0, 0, 0, 0.04)`,
        '&:focus': {
            outline: 'none'
        },
        '&:focus-within': {
            outline: 'none'
        },
    },
    "& .MuiDataGrid-columnHeaders": {
        background: `linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)`,
        minHeight: '56px !important',
        maxHeight: '56px !important',
        '& .MuiDataGrid-columnHeader': {
            background: `linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)`,
            '&:focus': {
                outline: 'none'
            },
            '&:focus-within': {
                outline: 'none'
            }
        }
    },
    "& .MuiDataGrid-columnHeaderTitle": {
        fontWeight: "500",
        textAlign: "center",
        width: "100%",
        letterSpacing: '0.01em',
        textTransform: 'none',
        color: 'rgba(0, 0, 0, 0.87)',
        padding: '0 8px',
        whiteSpace: 'normal',
        wordWrap: 'break-word',
        overflowWrap: 'break-word'
    },
    "& .MuiDataGrid-columnSeparator": {
        visibility: "visible",
        opacity: 0.5
    },
    ...(withPointer && {
        "& .MuiDataGrid-row": {
            cursor: "pointer",
        },
    }),
});

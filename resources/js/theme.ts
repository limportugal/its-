import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
    typography: {
        fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
        fontSize: 14,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                "@media (max-width:600px)": {
                    "html, body": {
                        fontSize: "0.875rem",
                    },
                },
                "@media (min-width:600px)": {
                    "html, body": {
                        fontSize: "1rem",
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: ({ theme }) => ({
                    textTransform: "none",
                    fontWeight: 500,

                    "&.MuiButton-sizeSmall": {
                        fontSize: "0.8125rem",
                        padding: "4px 10px",
                        minHeight: "32px",
                    },
                    "&.MuiButton-sizeMedium": {
                        fontSize: "0.875rem",
                    },
                    [theme.breakpoints.down("sm")]: {
                        "&.MuiButton-sizeLarge": {
                            fontSize: "0.875rem",
                        },
                    },
                }),
            },
            defaultProps: {
                size: "medium",
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: ({ theme }) => ({
                    [theme.breakpoints.up("sm")]: {
                        "& .MuiInputBase-root": {
                            fontSize: "0.875rem",
                        },
                    },
                }),
            },
            defaultProps: {
                size: "small",
            },
        },
    },
});

export default theme;

import { Box, Button, Stack, AppBar, Toolbar } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LoginIcon from "@mui/icons-material/Login";
import { Link, usePage } from "@inertiajs/react";

const SingInForm = () => {
    const { auth } = usePage().props;

    return (
        <Box>
            <AppBar position="absolute" sx={{ boxShadow: "none", backgroundColor: "transparent", width: "100%", margin: 0 }}>
                <Toolbar sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                    <Stack direction="row" spacing={2} alignItems="center" margin={1}>
                        {/* CHECK IF USER IS LOGGED IN */}
                        {auth?.user ? (
                            // IF LOGGED IN, SHOW DASHBOARD
                            <Link href={route("tickets.indexPendingTickets")} style={{ textDecoration: "none", color: "inherit" }}>
                                <Button size="medium" variant="contained" color="primary" startIcon={<DashboardIcon />}>Dashboard</Button>
                            </Link>
                        ) : (
                            // IF NOT LOGGED IN, SHOW LOG IN BUTTON
                            <Link href={route("login")} style={{ textDecoration: "none", color: "white" }}>
                                <Button 
                                    size="medium"
                                    variant="outlined" 
                                    color="primary"
                                    endIcon={<LoginIcon fontSize="small" />}
                                    sx={{
                                        color: "white",
                                        fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                                        py: { xs: 0.375, sm: 0.75 },
                                        px: { xs: 1, sm: 1.5 },
                                        minHeight: { xs: 32, sm: 36 },
                                        "& .MuiButton-endIcon": {
                                            "& svg": { fontSize: { xs: 18, sm: 20 } },
                                        },
                                        "&:hover": {
                                            backgroundColor: "primary.main"
                                        }
                                    }}
                                >
                                    Admin Login
                                </Button>
                            </Link>
                        )}
                    </Stack>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default SingInForm;

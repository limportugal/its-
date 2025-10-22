import { Box, Button, Stack, AppBar, Toolbar } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
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
                                    variant="text" 
                                    color="inherit"
                                    sx={{
                                        color: "white",
                                        "&:hover": {
                                            backgroundColor: "primary.main"
                                        }
                                    }}
                                >
                                    Beta Version 1.0
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

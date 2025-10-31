import React from "react";
import { Grid, Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import TicketSummaryDonut from "@/Pages/Dashboard/TicketSummaryDonut";
import TicketSummaryPerDaySpline from "@/Pages/Dashboard/TicketSummaryPerDaySpline";
import SystemCategoryCharts from "@/Pages/Dashboard/SystemCategorySummary/SystemCategoryCharts";
import { TicketSummaryData } from "@/Reuseable/types/dashboard/ticket-summary.types";

interface DashboardChartsProps {
    ticketSummaryData?: TicketSummaryData;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({
    ticketSummaryData,
}) => {
    // MUI BREAKPOINTS
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Box
            sx={{
                mt: isMobile ? -2 : 0,
                mx: isMobile ? -1 : 0,
                p: 1,
                minHeight: "100vh",
                backgroundColor: "#f8f9fa",
            }}
        >

            {/* Top Row - Two Charts */}
            <Grid
                container
                spacing={2}
                sx={{ mb: 2, mt: isMobile ? -0.8 : 0 }}
            >
                <Grid
                    size={{
                        xs: 12,
                        sm: 12,
                        md: 12,
                        lg: 8, // 7 columns for 1200px-1336px range
                        xl: 8, // 8 columns for 1536px+
                    }}
                >
                    <Box
                        sx={{
                            height: {
                                xs: "100%",
                                sm: "500px",
                                md: "520px",
                                lg: "500px",
                            },
                            width: "100%",
                        }}
                    >
                        <TicketSummaryPerDaySpline
                            ticketSummaryData={ticketSummaryData}
                        />
                    </Box>
                </Grid>
                <Grid
                    size={{
                        xs: 12,
                        sm: 12,
                        md: 12,
                        lg: 4, // 5 columns for 1200px-1336px range
                        xl: 4, // 4 columns for 1536px+
                    }}
                >
                    <Box
                        sx={{
                            height: {
                                xs: "100%",
                                sm: "450px",
                                md: "420px",
                                lg: "500px",
                            },
                            width: "100%",
                        }}
                    >
                        <TicketSummaryDonut
                            ticketSummaryData={ticketSummaryData}
                        />
                    </Box>
                </Grid>
            </Grid>

            {/* Bottom Row - System Category Charts */}
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                <Grid size={{ xs: 12 }}>
                    <Box>
                        <SystemCategoryCharts
                            ticketSummaryData={ticketSummaryData}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardCharts;

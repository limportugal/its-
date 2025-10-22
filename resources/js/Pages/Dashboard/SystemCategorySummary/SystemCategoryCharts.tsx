import React from "react";
import { Grid } from "@mui/material";

// TYPES
import { TicketSummaryData } from "@/Reuseable/types/dashboard/ticket-summary.types";

// COMPONENTS
import SystemDonut from "@/Pages/Dashboard/SystemCategorySummary/SystemDonut";
import CategoriesDonut from "@/Pages/Dashboard/SystemCategorySummary/CategoriesDonut";

interface SystemCategoryChartsProps {
    ticketSummaryData?: TicketSummaryData;
}

// SYSTEM CATEGORY CHARTS COMPONENT
const SystemCategoryCharts: React.FC<SystemCategoryChartsProps> = ({
    ticketSummaryData,
}) => {
    // Handle responsive container sizing
    React.useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            // Determine grid breakpoints (MUI standard)
            const isXs = width < 600; // xs: 0px, sm: 600px
            const isMd = width >= 900; // md: 900px
        };

        // Handle on mount
        handleResize();

        // Handle on resize
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Grid container spacing={2}>
            <Grid
                size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}
                sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "& > div": {
                        width: "100% !important",
                        height: { xs: "100%", sm: "480px", md: "480px", lg: "380px", xl: "500px" },
                    },
                }}
            >
                <SystemDonut ticketSummaryData={ticketSummaryData} />
            </Grid>
            <Grid
                size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}
                sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "& > div": {
                        width: "100% !important",
                        height: { xs: "100%", sm: "480px", md: "480px", lg: "380px", xl: "500px" },
                    },
                }}
            >
                <CategoriesDonut ticketSummaryData={ticketSummaryData} />
            </Grid>
        </Grid>
    );
};

export default SystemCategoryCharts;

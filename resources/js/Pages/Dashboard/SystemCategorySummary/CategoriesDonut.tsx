import React from "react";
import Chart from "react-apexcharts";
import { Paper, Typography, Box, useMediaQuery } from "@mui/material";
import {
    TicketSummaryData,
    TicketCategory,
} from "@/Reuseable/types/dashboard/ticket-summary.types";
import { getChartColors } from "@/Reuseable/utils/chartColors";
import { useTheme } from "@mui/material/styles";

interface CategoriesDonutProps {
    ticketSummaryData?: TicketSummaryData;
}

const CategoriesDonut: React.FC<CategoriesDonutProps> = ({
    ticketSummaryData,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isMd = useMediaQuery(theme.breakpoints.down("md"));

    if (!ticketSummaryData) {
        return (
            <Paper
                variant="outlined"
                elevation={0}
                sx={{
                    padding: 2,
                    borderRadius: "16px",
                    background: "linear-gradient(145deg, #ffffff, #f5f5f5)",
                    boxShadow:
                        "20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff",
                    border: "none",
                    textAlign: "center",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                        transform: "translateY(-5px)",
                    },
                }}
            >
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ color: "text.secondary" }}
                >
                    No ticket data available
                </Typography>
            </Paper>
        );
    }

    // FILTER CATEGORIES WITH TICKETS > 0 AND SORT BY TOTAL
    const categoryData = ticketSummaryData.system_category_data
        .filter((item) => item.total > 0)
        .sort((a, b) => b.total - a.total)
        // .slice(0, 10) // TOP 10 CATEGORIES
        .map((item) => ({
            name: `${item.system_name} - ${item.category_name}`,
            value: item.total,
        }));

    const options = {
        chart: {
            type: "donut" as const,
            height: isMobile ? "100%" : isMd ? 500 : 350,
            animations: {
                enabled: true,
                easing: "easeinout" as const,
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150,
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350,
                },
            },
            events: {
                dataPointSelection: function (
                    event: any,
                    chartContext: any,
                    config: any
                ) {
                    // Chart data point selected
                },
            },
        },
        colors: getChartColors(categoryData.length),
        plotOptions: {
            pie: {
                donut: {
                    size: "65%",
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#333",
                            offsetY: -10,
                        },
                        value: {
                            show: true,
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "#333",
                            formatter: function (val: string) {
                                return val + " tickets";
                            },
                        },
                        total: {
                            show: true,
                            showAlways: true,
                            label: "Total Issues",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#333",
                            formatter: function (w: any) {
                                const total = w.globals.seriesTotals.reduce(
                                    (a: number, b: number) => a + b,
                                    0
                                );
                                return total + " issues";
                            },
                        },
                    },
                },
            },
        },
        dataLabels: {
            enabled: true,
            style: {
                fontSize: "12px",
                fontWeight: "bold",
                colors: ["#fff"],
            },
            formatter: function (val: string, opts: any) {
                // GET THE ACTUAL COUNT AND TOTAL FOR THIS SEGMENT
                const actualValue = opts.w.globals.series[opts.seriesIndex];
                const total = opts.w.globals.seriesTotals.reduce(
                    (a: number, b: number) => a + b,
                    0
                );
                const actualPercentage = (actualValue / total) * 100;

                // CALCULATE ALL PERCENTAGES FIRST
                const series = opts.w.globals.series;
                const allPercentages = series.map(
                    (value: number) => (value / total) * 100
                );

                // ROUND ALL PERCENTAGES TO 1 DECIMAL PLACE
                const roundedPercentages = allPercentages.map((p: number) =>
                    parseFloat(p.toFixed(1))
                );

                // CALCULATE THE DIFFERENCE FROM 100%
                const currentTotal = roundedPercentages.reduce(
                    (sum: number, p: number) => sum + p,
                    0
                );
                const difference = 100 - currentTotal;

                // FIND THE LARGEST SEGMENT TO ADJUST
                const maxIndex = series.indexOf(Math.max(...series));

                const value = opts.w.config.series[opts.seriesIndex];

                // IF THIS IS THE LARGEST SEGMENT, ADD THE DIFFERENCE TO MAKE TOTAL EXACTLY 100%
                if (opts.seriesIndex === maxIndex) {
                    const adjustedPercentage =
                        roundedPercentages[opts.seriesIndex] + difference;
                    return adjustedPercentage.toFixed(1) + "%";
                }

                // FOR OTHER SEGMENTS, USE THE ROUNDED PERCENTAGE
                return roundedPercentages[opts.seriesIndex].toFixed(1) + "%";
            },
        },
        legend: {
            position: "right" as const,
            horizontalAlign: "left" as const,
            fontSize: "12px",
            fontWeight: 500,
            markers: {
                width: 12,
                height: 12,
                strokeWidth: 0,
                radius: 2,
                offsetX: 0,
                offsetY: 0,
            },
            itemMargin: {
                horizontal: isMobile ? 1 : 4,
                vertical: isMobile ? 1 : 3,
            },
            formatter: function (seriesName: string, opts: any) {
                const value = opts.w.config.series[opts.seriesIndex];
                // Truncate long names for better display
                const truncatedName =
                    seriesName.length > 55
                        ? seriesName.substring(0, 55) + "..."
                        : seriesName;
                return "&nbsp;&nbsp;" + truncatedName + ": " + value;
            },
        },
        tooltip: {
            y: {
                formatter: function (value: number) {
                    return value + " tickets";
                },
            },
        },
        responsive: [
            {
                breakpoint: 600, // sm: small (MUI default)
                options: {
                    chart: {
                        height: "500px",
                        toolbar: {
                            show: false,
                        },
                    },
                    legend: {
                        position: "bottom",
                        horizontalAlign: "left",
                        fontSize: "11px",
                        itemMargin: {
                            horizontal: 1,
                            vertical: 1,
                        },
                        markers: {
                            width: 8,
                            height: 8,
                            strokeWidth: 2,
                            radius: 1,
                            offsetX: 0,
                            offsetY: 0,
                        },
                        formatter: function (seriesName: string, opts: any) {
                            const value =
                                opts.w.config.series[opts.seriesIndex];
                            // Truncate long names for mobile - shorter limit
                            const truncatedName =
                                seriesName.length > 25
                                    ? seriesName.substring(0, 25) + "..."
                                    : seriesName;
                            return truncatedName + ": " + value;
                        },
                        floating: false,
                        offsetX: 0,
                        offsetY: 0,
                        width: undefined,
                        height: undefined,
                        containerMargin: {
                            left: 0,
                            top: 0,
                        },
                    },
                    plotOptions: {
                        pie: {
                            donut: {
                                size: "65%", // Smaller donut on mobile
                            },
                        },
                    },
                    dataLabels: {
                        enabled: true,
                        style: {
                            fontSize: "8px",
                            fontWeight: "bold",
                            colors: ["#fff"],
                        },
                        formatter: function (val: string, opts: any) {
                            // GET THE ACTUAL COUNT AND TOTAL FOR THIS SEGMENT
                            const actualValue =
                                opts.w.globals.series[opts.seriesIndex];
                            const total = opts.w.globals.seriesTotals.reduce(
                                (a: number, b: number) => a + b,
                                0
                            );
                            const actualPercentage =
                                (actualValue / total) * 100;

                            // CALCULATE ALL PERCENTAGES FIRST
                            const series = opts.w.globals.series;
                            const allPercentages = series.map(
                                (value: number) => (value / total) * 100
                            );

                            // ROUND ALL PERCENTAGES TO 1 DECIMAL PLACE
                            const roundedPercentages = allPercentages.map(
                                (p: number) => parseFloat(p.toFixed(1))
                            );

                            // CALCULATE THE DIFFERENCE FROM 100%
                            const currentTotal = roundedPercentages.reduce(
                                (sum: number, p: number) => sum + p,
                                0
                            );
                            const difference = 100 - currentTotal;

                            // FIND THE LARGEST SEGMENT TO ADJUST
                            const maxIndex = series.indexOf(
                                Math.max(...series)
                            );

                            const value =
                                opts.w.config.series[opts.seriesIndex];

                            let percentage;
                            // IF THIS IS THE LARGEST SEGMENT, ADD THE DIFFERENCE TO MAKE TOTAL EXACTLY 100%
                            if (opts.seriesIndex === maxIndex) {
                                percentage =
                                    roundedPercentages[opts.seriesIndex] +
                                    difference;
                            } else {
                                // FOR OTHER SEGMENTS, USE THE ROUNDED PERCENTAGE
                                percentage =
                                    roundedPercentages[opts.seriesIndex];
                            }

                            // RETURN BOTH COUNT AND PERCENTAGE
                            return (
                                actualValue + "\n" + percentage.toFixed(1) + "%"
                            );
                        },
                    },
                },
            },
            {
                breakpoint: 900, // md: medium (MUI default)
                options: {
                    chart: {
                        height: "350px",
                    },
                    legend: {
                        position: "right",
                        horizontalAlign: "left",
                        fontSize: "10px",
                        itemMargin: {
                            horizontal: 3,
                            vertical: 2,
                        },
                        formatter: function (seriesName: string, opts: any) {
                            const value =
                                opts.w.config.series[opts.seriesIndex];
                            // Truncate long names for tablet
                            const truncatedName =
                                seriesName.length > 27
                                    ? seriesName.substring(0, 27) + "..."
                                    : seriesName;
                            return (
                                "&nbsp;&nbsp;" + truncatedName + ": " + value
                            );
                        },
                    },
                },
            },
            {
                breakpoint: 1200, // lg: large (MUI default)
                options: {
                    chart: {
                        height: "400px",
                    },
                    legend: {
                        position: "right",
                        horizontalAlign: "left",
                        fontSize: "14px",
                        itemMargin: {
                            horizontal: 3,
                            vertical: 2,
                        },
                        formatter: function (seriesName: string, opts: any) {
                            const value =
                                opts.w.config.series[opts.seriesIndex];
                            // Truncate long names for desktop
                            const truncatedName =
                                seriesName.length > 25
                                    ? seriesName.substring(0, 25) + "..."
                                    : seriesName;
                            return (
                                "&nbsp;&nbsp;" + truncatedName + ": " + value
                            );
                        },
                    },
                },
            },
            {
                breakpoint: 1536, // xl: extra-large (MUI default)
                options: {
                    chart: {
                        height: "400px",
                    },
                    legend: {
                        position: "right",
                        horizontalAlign: "left",
                        fontSize: "12px",
                        itemMargin: {
                            horizontal: 2,
                            vertical: 2,
                        },
                        formatter: function (seriesName: string, opts: any) {
                            const value =
                                opts.w.config.series[opts.seriesIndex];
                            // Truncate long names for medium desktop
                            const truncatedName =
                                seriesName.length > 25
                                    ? seriesName.substring(0, 25) + "..."
                                    : seriesName;
                            return (
                                "&nbsp;&nbsp;" + truncatedName + ": " + value
                            );
                        },
                    },
                },
            },
        ],
    };

    const series = categoryData.map((item) => item.value);

    return (
        <Paper
            variant="outlined"
            elevation={0}
            sx={{
                padding: 2,
                borderRadius: "16px",
                background: "#ffffff",
                boxShadow: "20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff",
                border: "none",
                height: "100%",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                    transform: "translateY(-5px)",
                },
                backdropFilter: "blur(10px)",
                position: "relative",
            }}
        >
            <Typography
                variant="h6"
                component="div"
                sx={{
                    mb: 2,
                    color: "primary.main",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                    fontSize: "1.1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textTransform: "uppercase",
                    textAlign: "center",
                }}
            >
                All Categories
            </Typography>
            <Box sx={{ height: "calc(100% - 60px)" }}>
                <Chart
                    options={{
                        ...options,
                        labels: categoryData.map((item) => item.name),
                    }}
                    series={series}
                    type="donut"
                    height={isMobile ? "100%" : isMd ? 500 : 350}
                />
            </Box>
        </Paper>
    );
};

export default CategoriesDonut;

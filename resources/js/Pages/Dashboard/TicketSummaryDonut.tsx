import React from 'react';
import { Paper, Typography, Box, useMediaQuery, useTheme } from '@mui/material';
import { red, green, blue, deepPurple, grey, orange, blueGrey, amber, teal, pink } from '@mui/material/colors';
import ReactApexChart from 'react-apexcharts';
import { TicketSummaryData } from '@/Reuseable/types/dashboard/ticket-summary.types';
import { snakeCaseToTitleCase } from '@/Reuseable/utils/capitalize';

interface TicketSummaryDonutProps {
    ticketSummaryData?: TicketSummaryData;
}

const TicketSummaryDonut: React.FC<TicketSummaryDonutProps> = ({ ticketSummaryData }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // If no data is provided, show empty state
    if (!ticketSummaryData || !ticketSummaryData.status_counts) {
        return (
            <Paper
                variant="outlined"
                elevation={0}
                sx={{
                    padding: 2,
                    borderRadius: "16px",
                    background: "linear-gradient(145deg, #ffffff, #f5f5f5)",
                    boxShadow: "20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff",
                    border: "none",
                    textAlign: "center",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                        transform: "translateY(-5px)",
                    }
                }}
            >
                <Typography variant="h6" component="div" sx={{ color: 'text.secondary' }}>
                    No ticket summary data available
                </Typography>
            </Paper>
        );
    }

    // Prepare data for the chart - filter out 0 values
    const statusEntries = Object.entries(ticketSummaryData.status_counts)
        .filter(([_, count]) => count > 0);
    const series = statusEntries.map(([_, count]) => count);
    const originalLabels = statusEntries.map(([status, _]) => status);
    const labels = originalLabels.map(status => snakeCaseToTitleCase(status));


    // Define colors for different ticket statuses - matching StatusChip colors
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'new_ticket':
                return blue[400];
            case 'assigned':
                return green[400];
            case 'follow-up':
                return teal[400];
            case 're-open':
                return pink[400];
            case 'returned':
                return orange[400];
            case 'reminder':
                return amber[400];
            case 'resubmitted':
                return deepPurple[400];
            case 'closed':
                return blueGrey[400];
            case 'cancelled':
                return red[400];
            case 'deleted':
                return grey[400];
            default:
                return grey[400];
        }
    };

    const chartColors = originalLabels.map(status => getStatusColor(status));


    // Simple donut chart options based on ApexCharts React documentation
    const options: ApexCharts.ApexOptions = {
        chart: {
            type: 'donut' as const,
            height: isMobile ? '100%' : 350,
            width: '100%',
            animations: {
                enabled: true,
                easing: 'easeinout' as const,
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350
                }
            },
            events: {
                dataPointSelection: function (event: any, chartContext: any, config: any) {
                    // Chart data point selected
                }
            }
        },
        colors: chartColors,
        plotOptions: {
            pie: {
                donut: {
                    size: isMobile ? '60%' : '65%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            showAlways: true,
                            label: 'Total Tickets',
                            fontSize: isMobile ? '14px' : '18px',
                            fontWeight: 600,
                            color: '#373d3f',
                            formatter: function (w) {
                                const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                                return total.toString();
                            }
                        }
                    }
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val: string, opts: any) {
                // Get the actual count and total for this segment
                const actualValue = opts.w.globals.series[opts.seriesIndex];
                const total = opts.w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                const actualPercentage = (actualValue / total) * 100;

                // Calculate all percentages first
                const series = opts.w.globals.series;
                const allPercentages = series.map((value: number) => (value / total) * 100);

                // Round all percentages to 1 decimal place
                const roundedPercentages = allPercentages.map((p: number) => parseFloat(p.toFixed(1)));

                // Calculate the difference from 100%
                const currentTotal = roundedPercentages.reduce((sum: number, p: number) => sum + p, 0);
                const difference = 100 - currentTotal;

                // Find the largest segment to adjust
                const maxIndex = series.indexOf(Math.max(...series));

                // If this is the largest segment, add the difference to make total exactly 100%
                if (opts.seriesIndex === maxIndex) {
                    const adjustedPercentage = roundedPercentages[opts.seriesIndex] + difference;
                    return adjustedPercentage.toFixed(1) + "%";
                }

                // For other segments, use the rounded percentage
                return roundedPercentages[opts.seriesIndex].toFixed(1) + "%";
            },
            style: {
                colors: ['#fff'],
                fontSize: isMobile ? '12px' : '14px'
            }
        },
        legend: {
            show: true,
            showForSingleSeries: true,
            showForNullSeries: true,
            showForZeroSeries: true,
            position: 'bottom' as const,
            horizontalAlign: 'center' as const,
            fontSize: '12px',
            fontWeight: 500,
            markers: {
                size: 12,
                strokeWidth: 0,
                offsetX: 0,
                offsetY: 0
            },
            itemMargin: {
                horizontal: isMobile ? 1 : 4,
                vertical: isMobile ? 1 : 3
            },
            formatter: function (seriesName: string, opts: any) {
                const value = opts.w.config.series[opts.seriesIndex];
                // Truncate long names for better display
                const truncatedName = seriesName.length > 55 ? seriesName.substring(0, 55) + '...' : seriesName;
                return '&nbsp;&nbsp;' + truncatedName + ': ' + value;
            }
        },
        tooltip: {
            y: {
                formatter: function (val: number) {
                    return val + " tickets"
                }
            }
        },
        responsive: [{
            breakpoint: 600, // sm: small (MUI default)
            options: {
                chart: {
                    height: '400px',
                    toolbar: {
                        show: false
                    }
                },
                legend: {
                    show: true,
                    showForSingleSeries: true,
                    showForNullSeries: true,
                    showForZeroSeries: true,
                    position: 'bottom',
                    horizontalAlign: 'center',
                    fontSize: '11px',
                    itemMargin: {
                        horizontal: 1,
                        vertical: 12
                    },
                    markers: {
                        size: 7,
                        strokeWidth: 2,
                        offsetX: 0,
                        offsetY: 0
                    },
                    formatter: function (seriesName: string, opts: any) {
                        const value = opts.w.config.series[opts.seriesIndex];
                        // Truncate long names for mobile - shorter limit
                        const truncatedName = seriesName.length > 25 ? seriesName.substring(0, 25) + '...' : seriesName;
                        return truncatedName + ': ' + value;
                    },
                    floating: false,
                    offsetX: 0,
                    offsetY: 0,
                    width: undefined,
                    height: undefined,
                    containerMargin: {
                        left: 0,
                        top: 0,
                    }
                },
                plotOptions: {
                    pie: {
                        donut: {
                            size: '65%' // Same size as CategoriesDonut
                        }
                    }
                },
                dataLabels: {
                    enabled: true,
                    style: {
                        fontSize: '8px',
                        fontWeight: 'bold',
                        colors: ['#fff']
                    },
                    formatter: function (val: string, opts: any) {
                        // GET THE ACTUAL COUNT AND TOTAL FOR THIS SEGMENT
                        const actualValue = opts.w.globals.series[opts.seriesIndex];
                        const total = opts.w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                        const actualPercentage = (actualValue / total) * 100;

                        // CALCULATE ALL PERCENTAGES FIRST
                        const series = opts.w.globals.series;
                        const allPercentages = series.map((value: number) => (value / total) * 100);

                        // ROUND ALL PERCENTAGES TO 1 DECIMAL PLACE
                        const roundedPercentages = allPercentages.map((p: number) => parseFloat(p.toFixed(1)));

                        // CALCULATE THE DIFFERENCE FROM 100%
                        const currentTotal = roundedPercentages.reduce((sum: number, p: number) => sum + p, 0);
                        const difference = 100 - currentTotal;

                        // FIND THE LARGEST SEGMENT TO ADJUST
                        const maxIndex = series.indexOf(Math.max(...series));

                        const value = opts.w.config.series[opts.seriesIndex];

                        let percentage;
                        // IF THIS IS THE LARGEST SEGMENT, ADD THE DIFFERENCE TO MAKE TOTAL EXACTLY 100%
                        if (opts.seriesIndex === maxIndex) {
                            percentage = roundedPercentages[opts.seriesIndex] + difference;
                        } else {
                            // FOR OTHER SEGMENTS, USE THE ROUNDED PERCENTAGE
                            percentage = roundedPercentages[opts.seriesIndex];
                        }

                        // RETURN BOTH COUNT AND PERCENTAGE
                        return actualValue + '\n' + percentage.toFixed(1) + '%';
                    }
                }
            }
        },
            {
                breakpoint: 900, // md: medium (MUI default)
                options: {
                    chart: {
                        height: '350px'
                    },
                    legend: {
                        show: true,
                        showForSingleSeries: true,
                        showForNullSeries: true,
                        showForZeroSeries: true,
                        position: 'bottom',
                        horizontalAlign: 'center',
                        fontSize: '12px',
                        itemMargin: {
                            horizontal: 3,
                            vertical: 2
                        },
                        markers: {
                            size: 8,
                            strokeWidth: 2,
                            offsetX: 0,
                            offsetY: 0
                        },
                        formatter: function (seriesName: string, opts: any) {
                            const value = opts.w.config.series[opts.seriesIndex];
                            // Truncate long names for tablet
                            const truncatedName = seriesName.length > 30 ? seriesName.substring(0, 30) + '...' : seriesName;
                            return '&nbsp;&nbsp;' + truncatedName + ': ' + value;
                        }
                    }
                }
            },
            {
                breakpoint: 1200, // lg: large (MUI default)
                options: {
                    chart: {
                        height: '350px'
                    },
                    legend: {
                        show: true,
                        showForSingleSeries: true,
                        showForNullSeries: true,
                        showForZeroSeries: true,
                        position: 'bottom',
                        horizontalAlign: 'center',
                        fontSize: '12px',
                        itemMargin: {
                            horizontal: 3,
                            vertical: 2
                        },
                        markers: {
                            size: 8,
                            strokeWidth: 2,
                            offsetX: 0,
                            offsetY: 0
                        },
                        formatter: function (seriesName: string, opts: any) {
                            const value = opts.w.config.series[opts.seriesIndex];
                            // Truncate long names for desktop
                            const truncatedName = seriesName.length > 60 ? seriesName.substring(0, 60) + '...' : seriesName;
                            return '&nbsp;&nbsp;' + truncatedName + ': ' + value;
                        }
                    }
                }
            },
            {
                breakpoint: 1536, // xl: extra-large (MUI default)
                options: {
                    chart: {
                        height: '400px'
                    },
                    legend: {
                        show: true,
                        showForSingleSeries: true,
                        showForNullSeries: true,
                        showForZeroSeries: true,
                        position: 'bottom',
                        horizontalAlign: 'center',
                        fontSize: '12px',
                        itemMargin: {
                            horizontal: 2,
                            vertical: 5
                        },
                        markers: {
                            size: 8,
                            strokeWidth: 2,
                            offsetX: 0,
                            offsetY: 0
                        },
                        formatter: function (seriesName: string, opts: any) {
                            const value = opts.w.config.series[opts.seriesIndex];
                            // Truncate long names for medium desktop
                            const truncatedName = seriesName.length > 25 ? seriesName.substring(0, 25) + '...' : seriesName;
                            return '&nbsp;&nbsp;' + truncatedName + ': ' + value;
                        }
                    }
                }
            }
        ]
    };

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
                    color: 'primary.main',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textTransform: 'uppercase',
                    textAlign: 'center'
                }}
            >
                Ticket Summary
            </Typography>
            <Box sx={{ height: 'calc(100% - 60px)' }}>
                <ReactApexChart
                    options={{...options, labels}}
                    series={series}
                    type="donut"
                    height={isMobile ? '100%' : 350}
                />
            </Box>
        </Paper>
    );
};

export default TicketSummaryDonut;

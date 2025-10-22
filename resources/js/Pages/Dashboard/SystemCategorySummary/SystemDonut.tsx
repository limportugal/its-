import React from 'react';
import Chart from 'react-apexcharts';
import { Paper, Typography, Box, useMediaQuery } from '@mui/material';
import { TicketSummaryData } from '@/Reuseable/types/dashboard/ticket-summary.types';
import { getChartColors } from '@/Reuseable/utils/chartColors';
import { useTheme } from '@mui/material/styles';

interface SystemDonutProps {
    ticketSummaryData?: TicketSummaryData;
}

const SystemDonut: React.FC<SystemDonutProps> = ({ ticketSummaryData }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isMd = useMediaQuery(theme.breakpoints.down('md'));

    // Handle responsive breakpoints
    React.useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            // DETERMINE BREAKPOINT (MUI standard)
            let breakpoint = 'xs';
            if (width >= 600) breakpoint = 'sm';   // sm: 600px
            if (width >= 900) breakpoint = 'md';   // md: 900px
            if (width >= 1200) breakpoint = 'lg';  // lg: 1200px
            if (width >= 1536) breakpoint = 'xl';  // xl: 1536px
            
            // DETERMINE APEXCHARTS RESPONSIVE BREAKPOINT (MUI standard)
            let apexBreakpoint = 'default';
            let chartHeight = 350;
            if (width <= 600) {
                apexBreakpoint = '600px';  // sm: 600px
                chartHeight = 250;
            } else if (width <= 900) {
                apexBreakpoint = '900px';  // md: 900px
                chartHeight = 280;
            } else if (width <= 1200) {
                apexBreakpoint = '1200px'; // lg: 1200px
                chartHeight = 300;
            }
        };

        // Handle on mount
        handleResize();

        // Handle on resize
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!ticketSummaryData) {
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
                    No ticket data available
                </Typography>
            </Paper>
        );
    }

    // USE SYSTEM_COUNTS FROM TICKET SUMMARY DATA
    const systemTotals = ticketSummaryData.system_counts;

    // CONVERT TO ARRAY AND SORT BY TOTAL, EXCLUDE 'TOTAL' KEY
    const systemData = Object.entries(systemTotals)
        .filter(([key, total]) => key !== 'total' && total > 0)
        .sort(([, a], [, b]) => b - a)
        .map(([system, total]) => ({
            name: system,
            value: total
        }));

    const options = {
        chart: {
            type: 'donut' as const,
            height: isMobile ? '100%' : isMd ? 500 : 350,
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
                dataPointSelection: function(event: any, chartContext: any, config: any) {
                    // Chart data point selected
                }
            }
        },
        colors: getChartColors(systemData.length),
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#333',
                            offsetY: -10
                        },
                        value: {
                            show: true,
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: '#333',
                            formatter: function(val: string) {
                                return val + ' tickets';
                            }
                        },
                        total: {
                            show: true,
                            showAlways: true,
                            label: 'Total Systems',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#333',
                            formatter: function(w: any) {
                                const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                                return total + ' tickets';
                            }
                        }
                    }
                }
            }
        },
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '12px',
                fontWeight: 'bold',
                colors: ['#fff']
            },
            formatter: function(val: string, opts: any) {
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

                // IF THIS IS THE LARGEST SEGMENT, ADD THE DIFFERENCE TO MAKE TOTAL EXACTLY 100%
                if (opts.seriesIndex === maxIndex) {
                    const adjustedPercentage = roundedPercentages[opts.seriesIndex] + difference;
                    return adjustedPercentage.toFixed(1) + '%';
                }

                // FOR OTHER SEGMENTS, USE THE ROUNDED PERCENTAGE
                return roundedPercentages[opts.seriesIndex].toFixed(1) + '%';
            }
        },
        legend: {
            position: 'right' as const,
            horizontalAlign: 'center' as const,
            fontSize: '12px',
            fontWeight: 500,
            markers: {
                width: 12,
                height: 12,
                strokeWidth: 0,
                radius: 2,
                offsetX: 0,
                offsetY: 0
            },
            itemMargin: {
                horizontal: isMobile ? 1 : 4,
                vertical: isMobile ? 1 : 3
            },
            formatter: function(seriesName: string, opts: any) {
                const value = opts.w.config.series[opts.seriesIndex];
                // Truncate long names for better display
                const truncatedName = seriesName.length > 55 ? seriesName.substring(0, 55) + '...' : seriesName;
                return '&nbsp;&nbsp;' + truncatedName + ': ' + value;
            }
        },
        tooltip: {
            y: {
                formatter: function(value: number) {
                    return value + ' tickets';
                }
            }
        },
        responsive: [{
            breakpoint: 600, // sm: small (MUI default)
            options: {
                chart: {
                    height: '500px',
                    toolbar: {
                        show: false
                    }
                },
                legend: {
                    position: 'bottom',
                    horizontalAlign: 'left',
                    fontSize: '11px',
                    itemMargin: {
                        horizontal: 1,
                        vertical: 1
                    },
                    markers: {
                        width: 8,
                        height: 8,
                        strokeWidth: 2,
                        radius: 1,
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
                        position: 'right',
                        horizontalAlign: 'left',
                        fontSize: '10px',
                        itemMargin: {
                            horizontal: 3,
                            vertical: 2
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
                        height: '400px'
                    },
                    legend: {
                        position: 'right',
                        horizontalAlign: 'left',
                        fontSize: '14px',
                        itemMargin: {
                            horizontal: 3,
                            vertical: 2
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
                        position: 'right',
                        horizontalAlign: 'left',
                        fontSize: '12px',
                        itemMargin: {
                            horizontal: 4,
                            vertical: 2
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

    const series = systemData.map(item => item.value);

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
                System Distribution
            </Typography>
            <Box sx={{ height: 'calc(100% - 60px)' }}>
                <Chart
                    options={{
                        ...options,
                        labels: systemData.map(item => item.name)
                    }}
                    series={series}
                    type="donut"
                    height={isMobile ? '100%' : isMd ? 500 : 350}
                />
            </Box>
        </Paper>
    );
};

export default SystemDonut;

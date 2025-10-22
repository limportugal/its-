import React, { useState } from 'react';
import { Paper, Typography, Box, Tabs, Tab, Chip, Tooltip, useTheme, useMediaQuery } from '@mui/material';
import { colors } from '@mui/material';
import { deepPurple, pink, teal, amber, blueGrey, green, blue, orange, purple } from '@mui/material/colors';
import ReactApexChart from 'react-apexcharts';
import { TicketSummaryData } from '@/Reuseable/types/dashboard/ticket-summary.types';

interface TicketSummaryPerDaySplineProps {
    ticketSummaryData?: TicketSummaryData;
}

const TicketSummaryPerDaySpline: React.FC<TicketSummaryPerDaySplineProps> = ({ ticketSummaryData }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));     // <= 600px
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 600px - 900px
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));      // >= 900px
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));  // >= 1200px

    const getDefaultTab = () => {
        if (ticketSummaryData?.current_month_daily && Object.keys(ticketSummaryData.current_month_daily).length > 0) {
            return 0; // CURRENT MONTH TAB (first position)
        }
        if (ticketSummaryData?.previous_month_last_days && Object.keys(ticketSummaryData.previous_month_last_days).length > 0) {
            return 1; // LAST 7 DAYS TAB (second position)
        }
        if (ticketSummaryData?.previous_month_daily && Object.keys(ticketSummaryData.previous_month_daily).length > 0) {
            return 2; // PREVIOUS MONTH DAILY TAB (third position)
        }
        return 3; // MONTHLY OVERVIEW TAB (last position)
    };

    const [activeTab, setActiveTab] = useState(getDefaultTab());

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    // IF NO DATA IS PROVIDED, SHOW EMPTY STATE
    if (!ticketSummaryData || (!ticketSummaryData.status_per_month && !ticketSummaryData.status_per_day) ||
        (ticketSummaryData.status_per_month && Object.keys(ticketSummaryData.status_per_month).length === 0) ||
        (ticketSummaryData.status_per_day && Object.keys(ticketSummaryData.status_per_day).length === 0)) {
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

    // FUNCTION TO PREPARE CHART DATA BASED ON TAB SELECTION
    const prepareChartData = () => {
        let dataEntries: [string, any][];
        let useMonthlyData = false;
        let isLastDaysView = false;
        let isDailyView = false;
        let viewTitle = '';

        if (activeTab === 0 && ticketSummaryData.current_month_daily) {
            // CURRENT MONTH DAILY VIEW (FIRST TAB)
            dataEntries = Object.entries(ticketSummaryData.current_month_daily);
            isDailyView = true;
            viewTitle = 'Current Month Daily';
        } else if (activeTab === 1 && ticketSummaryData.previous_month_last_days) {
            // PREVIOUS MONTH'S LAST 7 DAYS VIEW (SECOND TAB - MOVED HERE)
            dataEntries = Object.entries(ticketSummaryData.previous_month_last_days);
            isLastDaysView = true;
            viewTitle = 'Previous Month - Last 7 Days';
        } else if (activeTab === 2 && ticketSummaryData.previous_month_daily) {
            // WHOLE PREVIOUS MONTH DAILY VIEW (THIRD TAB)
            dataEntries = Object.entries(ticketSummaryData.previous_month_daily);
            isDailyView = true;
            viewTitle = 'Previous Month Daily';
        } else if (activeTab === 3 && ticketSummaryData.status_per_month) {
            // MONTHLY OVERVIEW (FOURTH TAB - LAST POSITION)
            dataEntries = Object.entries(ticketSummaryData.status_per_month);
            useMonthlyData = true;
            viewTitle = 'Monthly Overview';
        } else if (ticketSummaryData.status_per_day) {
            // FALLBACK TO LEGACY DAILY DATA
            dataEntries = Object.entries(ticketSummaryData.status_per_day);
            isDailyView = true;
            viewTitle = 'Legacy Daily Data';
        } else {
            dataEntries = [];
            viewTitle = 'No Data';
        }

        // SORT ENTRIES CHRONOLOGICALLY (OLDEST TO NEWEST FOR BETTER CHART DISPLAY)
        const sortedEntries = dataEntries.sort(([dateA], [dateB]) => {
            if (useMonthlyData) {
                // FOR MONTHLY DATA, COMPARE YEAR-MONTH STRINGS
                return dateA.localeCompare(dateB);
            } else {
                // FOR DAILY DATA, COMPARE DATES
                return new Date(dateA).getTime() - new Date(dateB).getTime();
            }
        });

        const categories = sortedEntries.map(([key, _]) => {
            if (useMonthlyData) {
                // FOR MONTHLY DATA, CREATE A DATE FROM THE MONTH KEY (e.g., "2025-09")
                const [year, month] = key.split('-');
                const dateObj = new Date(parseInt(year), parseInt(month) - 1, 1);
                return dateObj.getTime();
            } else {
                // FOR DAILY DATA, CONVERT DATE STRING TO TIMESTAMP
                const dateObj = new Date(key);
                return dateObj.getTime();
            }
        });

        return {
            reversedEntries: sortedEntries,
            categories,
            useMonthlyData,
            isLastDaysView,
            isDailyView,
            viewTitle
        };
    };

    const { reversedEntries, categories, useMonthlyData, isLastDaysView, isDailyView, viewTitle } = prepareChartData();

    // DEFINE STATUS COLORS TO MATCH StatusChip COMPONENT
    const statusColors = {
        new_ticket: colors.blue[500],
        assigned: colors.green[500],
        'follow-up': teal[500],
        're-open': pink[500],
        returned: colors.orange[500],
        reminder: amber[500],
        resubmitted: deepPurple[500],
        closed: blueGrey[500],
        cancelled: colors.red[500],
        total: colors.grey[800]
    };

    // CREATE SERIES FOR EACH STATUS (EXCLUDING TOTAL)
    const statusSeries = Object.keys(statusColors).filter(status => status !== 'total').map(status => ({
        name: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
        data: reversedEntries.map(([_, dayData]) => (dayData as any)[status] || 0)
    }));

    const series = statusSeries;

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: 'area' as const,
            offsetY: 20,
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                }
            },
            zoom: {
                enabled: true,
                type: 'x',
                autoScaleYaxis: true,
                allowMouseWheelZoom: true
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth' as const,
            width: 3,
            colors: Object.values(statusColors).filter((_, index) => index < Object.keys(statusColors).length - 1) // Exclude total color
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.1,
                stops: [0, 90, 100]
            }
        },
        colors: Object.values(statusColors).filter((_, index) => index < Object.keys(statusColors).length - 1), // Exclude total color
        xaxis: {
            type: 'datetime',
            categories: categories,
            labels: {
                show: true,
                rotate: -45,
                style: {
                    colors: colors.grey[600],
                    fontSize: '12px'
                },
                format: useMonthlyData ? 'MMM yyyy' : 'dd MMM',
                datetimeUTC: false,
                datetimeFormatter: {
                    year: 'yyyy',
                    month: useMonthlyData ? 'MMM yyyy' : 'MMM',
                    day: useMonthlyData ? 'MMM yyyy' : 'dd',
                    hour: 'HH:mm'
                }
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            crosshairs: {
                show: true,
                position: 'front',
                stroke: {
                    color: '#b6b6b6',
                    width: 1,
                    dashArray: 0
                },
                fill: {
                    type: 'solid',
                    color: '#B1B9C4'
                }
            },
            tooltip: {
                enabled: true,
                style: {
                    fontSize: '12px',
                    fontFamily: undefined
                }
            }
        },
        yaxis: {
            title: {
                text: 'Number of Tickets',
                style: {
                    color: colors.grey[600],
                    fontSize: '14px',
                    fontWeight: 600
                }
            },
            labels: {
                style: {
                    colors: colors.grey[600],
                    fontSize: '12px'
                }
            },
            min: 0
        },
        grid: {
            borderColor: colors.grey[200],
            strokeDashArray: 4,
            xaxis: {
                lines: {
                    show: true
                }
            },
            yaxis: {
                lines: {
                    show: true
                }
            }
        },
        tooltip: {
            shared: true,
            intersect: false,
            x: {
                format: useMonthlyData ? 'MMM yyyy' : 'dd MMM yyyy'
            },
            style: {
                fontSize: '12px',
                fontFamily: undefined
            },
            marker: {
                show: true
            },
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                const date = w.globals.labels[dataPointIndex];

                // Calculate total from all series
                const totalValue = series.reduce((sum: number, s: number[]) => sum + s[dataPointIndex], 0);

                // Format the date properly - convert timestamp back to readable date
                const dateObj = new Date(categories[dataPointIndex]);
                const formattedDate = useMonthlyData
                    ? dateObj.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                    })
                    : dateObj.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit'
                    });

                let tooltipContent = `<div style="padding: 10px; background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">`;
                tooltipContent += `<div style="font-weight: bold; margin-bottom: 8px; color: #333; border-bottom: 2px solid #2196F3; padding-bottom: 4px;">${formattedDate}</div>`;
                tooltipContent += `<div style="font-weight: bold; color: #333; background: #f5f5f5; padding: 6px; border-radius: 4px; margin-bottom: 8px;">Total: ${totalValue}</div>`;

                // ADD INDIVIDUAL STATUS COUNTS
                for (let i = 0; i < series.length; i++) {
                    const value = series[i][dataPointIndex];
                    const seriesName = w.globals.seriesNames[i];
                    const color = w.globals.colors[i];
                    if (value > 0) {
                        tooltipContent += `<div style="display: flex; align-items: center; margin-bottom: 4px;">`;
                        tooltipContent += `<span style="width: 12px; height: 12px; background: ${color}; border-radius: 50%; margin-right: 8px;"></span>`;
                        tooltipContent += `<span>${seriesName}: ${value}</span>`;
                        tooltipContent += `</div>`;
                    }
                }

                tooltipContent += `</div>`;
                return tooltipContent;
            }
        },
        markers: {
            size: 0,
            hover: {
                size: 4
            },
            strokeColors: '#fff',
            strokeWidth: 2
        },
        legend: {
            position: 'bottom',
            offsetY: isMobile ? 5 : isTablet ? 10 : isDesktop ? -5 : isLargeScreen ? -5 : 10,
            horizontalAlign: 'center',
            itemMargin: {
                horizontal: isMobile ? 8 : isTablet ? 8 : isDesktop ? 8 : isLargeScreen ? 12 : 5,
                vertical: isMobile ? 5 : isTablet ? 20 : isDesktop ? 20 : isLargeScreen ? 20 : 5
            },
            fontSize: isMobile ? '10px' : isTablet ? '10px' : isDesktop ? '10px' : isLargeScreen ? '12px' : '10px',
            fontFamily: 'Arial, sans-serif',
            show: true,
            showForSingleSeries: true,
            showForNullSeries: true,
            showForZeroSeries: true,
            floating: false,
            markers: {
                size: isMobile ? 6 : 7,
                strokeWidth: 0,
                offsetX: 0,
                offsetY: 0
            }
        },
    };

    // GET CHART TITLE BASED ON ACTIVE TAB
    const getChartTitle = () => {
        return viewTitle || 'Ticket Statistics';
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
                overflow: "hidden",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                    transform: "translateY(-5px)",
                },
                backdropFilter: "blur(10px)",
                position: "relative",
            }}
        >
            <Box sx={{
                position: "sticky",
                top: 0,
                background: "linear-gradient(to right, #ffffff, rgba(33, 150, 243, 0.05))",
                zIndex: 1,
                borderBottom: '2px solid rgba(33, 150, 243, 0.2)',
                pb: 1
            }}>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        color: 'primary.main',
                        pt: 2,
                        pb: 1,
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        fontSize: '1.1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textTransform: 'uppercase',
                    }}
                >
                    {getChartTitle()}
                </Typography>

                {/* 🚀 Ultra-Fast Performance Metrics */}
                {ticketSummaryData.performance_metrics && (
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 1 }}>
                        {/* SHOW TOTAL RESPONSE TIME (MOST IMPORTANT METRIC) */}
                        {ticketSummaryData.performance_metrics.total_response_time_ms && (
                            <Tooltip title={`Total API response time including cache lookup. Ultra-fast optimization: ${ticketSummaryData.performance_metrics.optimization_level || 'OPTIMIZED'}`}>
                                <Chip
                                    label={`⚡ Load: ${ticketSummaryData.performance_metrics.total_response_time_ms}ms`}
                                    size="small"
                                    variant="filled"
                                    sx={{
                                        fontWeight: 'bold',
                                        cursor: 'help',
                                        backgroundColor: green[50],
                                        color: green[800],
                                        border: `1px solid ${green[200]}`,
                                        '&:hover': {
                                            backgroundColor: green[100],
                                        }
                                    }}
                                />
                            </Tooltip>
                        )}

                        {/* DAILY QUERY TIME - ALWAYS SHOW IF AVAILABLE */}
                        {ticketSummaryData.performance_metrics.detailed_daily_query_time_ms !== undefined && ticketSummaryData.performance_metrics.detailed_daily_query_time_ms !== null && (
                            <Tooltip title={`Time taken to process daily data queries. Value: ${ticketSummaryData.performance_metrics.detailed_daily_query_time_ms}`}>
                                <Chip
                                    label={`📅 Daily: ${ticketSummaryData.performance_metrics.detailed_daily_query_time_ms}ms`}
                                    size="small"
                                    variant="filled"
                                    sx={{
                                        cursor: 'help',
                                        fontWeight: 'bold',
                                        backgroundColor: blue[50],
                                        color: blue[800],
                                        border: `1px solid ${blue[200]}`,
                                        '&:hover': {
                                            backgroundColor: blue[100],
                                        }
                                    }}
                                />
                            </Tooltip>
                        )}

                        {/* RECORDS PROCESSED */}
                        {(ticketSummaryData.performance_metrics.total_records_processed !== undefined || ticketSummaryData.performance_metrics.total_daily_records !== undefined) && (
                            <Tooltip title="Number of database records processed">
                                <Chip
                                    label={`📊 ${ticketSummaryData.performance_metrics.total_records_processed || ticketSummaryData.performance_metrics.total_daily_records} records`}
                                    size="small"
                                    variant="filled"
                                    sx={{
                                        cursor: 'help',
                                        backgroundColor: orange[50],
                                        color: orange[800],
                                        border: `1px solid ${orange[200]}`,
                                        '&:hover': {
                                            backgroundColor: orange[100],
                                        }
                                    }}
                                />
                            </Tooltip>
                        )}

                        {/* MEMORY USAGE */}
                        <Tooltip title="Peak memory usage during data processing">
                            <Chip
                                label={`💾 ${ticketSummaryData.performance_metrics.memory_usage_mb}MB`}
                                size="small"
                                variant="filled"
                                sx={{
                                    cursor: 'help',
                                    backgroundColor: purple[50],
                                    color: purple[800],
                                    border: `1px solid ${purple[200]}`,
                                    '&:hover': {
                                        backgroundColor: purple[100],
                                    }
                                }}
                            />
                        </Tooltip>
                    </Box>
                )}

                {/* TABS FOR DIFFERENT VIEWS */}
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        minHeight: 'auto',
                        '& .MuiTabs-indicator': {
                            backgroundColor: 'primary.main',
                        },
                        '& .MuiTabs-scrollButtons': {
                            color: 'primary.main',
                        }
                    }}
                >
                    {ticketSummaryData.current_month_daily && (
                        <Tab
                            label={`Current Month (${Object.keys(ticketSummaryData.current_month_daily).length} days)`}
                            sx={{
                                minHeight: 'auto',
                                py: 1,
                                px: 2,
                                fontSize: '0.75rem',
                                textTransform: 'none',
                                minWidth: 'auto'
                            }}
                        />
                    )}
                    {ticketSummaryData.previous_month_last_days && (
                        <Tab
                            label="Last 7 Days (Prev Month)"
                            sx={{
                                minHeight: 'auto',
                                py: 1,
                                px: 2,
                                fontSize: '0.75rem',
                                textTransform: 'none',
                                minWidth: 'auto'
                            }}
                        />
                    )}
                    {ticketSummaryData.previous_month_daily && (
                        <Tab
                            label={`Previous Month (${Object.keys(ticketSummaryData.previous_month_daily).length} days)`}
                            sx={{
                                minHeight: 'auto',
                                py: 1,
                                px: 2,
                                fontSize: '0.75rem',
                                textTransform: 'none',
                                minWidth: 'auto'
                            }}
                        />
                    )}
                    {ticketSummaryData.status_per_month && (
                        <Tab
                            label={`Monthly Overview (${ticketSummaryData.total_months})`}
                            sx={{
                                minHeight: 'auto',
                                py: 1,
                                px: 2,
                                fontSize: '0.75rem',
                                textTransform: 'none',
                                minWidth: 'auto'
                            }}
                        />
                    )}
                </Tabs>
            </Box>

            <div id="chart" style={{ 
                height: "calc(100% - 140px)", 
                padding: isMobile ? "10px 5px 60px 5px" : "10px 10px 70px 10px" 
            }}>
                <ReactApexChart
                    options={options}
                    series={series}
                    type="area"
                    height={isMobile ? 300 : isTablet ? 320 : 350}
                />
            </div>
        </Paper>
    );
};

export default TicketSummaryPerDaySpline;

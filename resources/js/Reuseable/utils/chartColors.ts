// Vibrant color palette for consistent chart colors
export const VIBRANT_CHART_COLORS = [
    '#008FFB', // Bright Blue
    '#00E396', // Vibrant Green
    '#FEB019', // Bright Orange
    '#FF4560', // Strong Red
    '#775DD0', // Deep Purple
    '#3F51B5', // Indigo Blue
    '#03A9F4', // Light Blue
    '#4CAF50', // Material Green
    '#F9CE1D', // Golden Yellow
    '#FF9800', // Orange
    '#9C27B0', // Purple
    '#E91E63', // Pink
    '#607D8B', // Blue Grey
    '#795548', // Brown
    '#FF5722', // Deep Orange
    '#8BC34A', // Light Green
    '#FFC107', // Amber
    '#2196F3', // Blue
    '#FF4081', // Pink Red
    '#00BCD4', // Cyan
    '#4CAF50', // Green
    '#FF9800', // Orange
    '#9C27B0', // Purple
    '#F44336', // Red
    '#3F51B5', // Indigo
    '#00BCD4', // Cyan
    '#8BC34A', // Light Green
    '#FFC107', // Amber
    '#FF5722', // Deep Orange
    '#607D8B'  // Blue Grey
];

// Extended vibrant color palette for charts with many categories
export const EXTENDED_VIBRANT_COLORS = [
    ...VIBRANT_CHART_COLORS,
    '#E91E63', '#00BCD4', '#4CAF50', '#FF9800', '#9C27B0',
    '#F44336', '#3F51B5', '#00BCD4', '#8BC34A', '#FFC107',
    '#FF5722', '#607D8B', '#795548', '#FF4081', '#2196F3',
    '#4CAF50', '#FF9800', '#9C27B0', '#F44336', '#3F51B5',
    '#00BCD4', '#8BC34A', '#FFC107', '#FF5722', '#607D8B',
    '#795548', '#FF4081', '#2196F3', '#4CAF50', '#FF9800'
];

/**
 * Get colors for a chart based on the number of data points
 * @param count Number of data points
 * @returns Array of colors
 */
export const getChartColors = (count: number): string[] => {
    if (count <= VIBRANT_CHART_COLORS.length) {
        return VIBRANT_CHART_COLORS.slice(0, count);
    }
    return EXTENDED_VIBRANT_COLORS.slice(0, count);
};

/**
 * Get a specific color by index with fallback
 * @param index Color index
 * @returns Color hex code
 */
export const getColorByIndex = (index: number): string => {
    return EXTENDED_VIBRANT_COLORS[index % EXTENDED_VIBRANT_COLORS.length];
};

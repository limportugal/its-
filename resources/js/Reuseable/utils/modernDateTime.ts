import { format, isValid, parseISO, formatDistanceToNow, isToday, isYesterday, isThisWeek, isThisYear } from "date-fns";

// Enhanced date formatting options
export interface DateTimeFormatOptions {
    includeTime?: boolean;
    includeSeconds?: boolean;
    format?: 'full' | 'compact' | 'minimal' | 'relative' | 'smart';
    locale?: string;
}

// Smart date formatting that shows relative time for recent dates
export const formatSmartDate = (dateString: string | null | undefined, options: DateTimeFormatOptions = {}): string => {
    if (!dateString) return "N/A";

    const parsedDate = isNaN(Date.parse(dateString))
        ? parseISO(dateString)
        : new Date(dateString);

    if (!isValid(parsedDate)) {
        return "Invalid Date";
    }

    const { format: formatType = 'smart', includeTime = false, includeSeconds = false } = options;

    switch (formatType) {
        case 'relative':
            return formatDistanceToNow(parsedDate, { addSuffix: true });
        
        case 'smart':
            if (isToday(parsedDate)) {
                const timeFormat = includeSeconds ? 'hh:mm:ss a' : 'hh:mm a';
                return `Today at ${format(parsedDate, timeFormat)}`;
            } else if (isYesterday(parsedDate)) {
                const timeFormat = includeSeconds ? 'hh:mm:ss a' : 'hh:mm a';
                return `Yesterday at ${format(parsedDate, timeFormat)}`;
            } else if (isThisWeek(parsedDate)) {
                const timeFormat = includeTime ? (includeSeconds ? 'EEEE hh:mm:ss a' : 'EEEE hh:mm a') : 'EEEE';
                return format(parsedDate, timeFormat);
            } else if (isThisYear(parsedDate)) {
                const timeFormat = includeTime ? (includeSeconds ? 'MMM dd hh:mm:ss a' : 'MMM dd hh:mm a') : 'MMM dd';
                return format(parsedDate, timeFormat);
            } else {
                const timeFormat = includeTime ? (includeSeconds ? 'MMM dd, yyyy hh:mm:ss a' : 'MMM dd, yyyy hh:mm a') : 'MMM dd, yyyy';
                return format(parsedDate, timeFormat);
            }
        
        case 'compact':
            const compactTimeFormat = includeTime ? (includeSeconds ? 'MMM dd, yyyy hh:mm:ss a' : 'MMM dd, yyyy hh:mm a') : 'MMM dd, yyyy';
            return format(parsedDate, compactTimeFormat);
        
        case 'minimal':
            const minimalTimeFormat = includeTime ? (includeSeconds ? 'MM/dd/yyyy hh:mm:ss a' : 'MM/dd/yyyy hh:mm a') : 'MM/dd/yyyy';
            return format(parsedDate, minimalTimeFormat);
        
        case 'full':
        default:
            const fullTimeFormat = includeTime ? (includeSeconds ? 'EEEE, MMMM dd, yyyy hh:mm:ss a' : 'EEEE, MMMM dd, yyyy hh:mm a') : 'EEEE, MMMM dd, yyyy';
            return format(parsedDate, fullTimeFormat);
    }
};

// Enhanced time formatting with modern options
export const formatModernTime = (dateString: string | null | undefined, options: { includeSeconds?: boolean; format24Hour?: boolean } = {}): string => {
    if (!dateString) return "N/A";

    const parsedDate = isNaN(Date.parse(dateString))
        ? parseISO(dateString)
        : new Date(dateString);

    if (!isValid(parsedDate)) {
        return "Invalid Time";
    }

    const { includeSeconds = false, format24Hour = false } = options;
    
    if (format24Hour) {
        return format(parsedDate, includeSeconds ? 'HH:mm:ss' : 'HH:mm');
    } else {
        return format(parsedDate, includeSeconds ? 'hh:mm:ss a' : 'hh:mm a');
    }
};

// Get current date and time in various formats
export const getCurrentDateTime = () => {
    const now = new Date();
    return {
        full: format(now, 'EEEE, MMMM dd, yyyy hh:mm:ss a'),
        compact: format(now, 'MMM dd, yyyy hh:mm a'),
        minimal: format(now, 'MM/dd/yyyy hh:mm a'),
        timeOnly: format(now, 'hh:mm:ss a'),
        dateOnly: format(now, 'MMM dd, yyyy'),
        iso: now.toISOString(),
        timestamp: now.getTime(),
        smart: formatSmartDate(now.toISOString(), { includeTime: true, includeSeconds: true })
    };
};

// Format duration between two dates
export const formatDuration = (startDate: string | Date, endDate: string | Date = new Date()): string => {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    
    if (!isValid(start) || !isValid(end)) {
        return "Invalid Duration";
    }

    return formatDistanceToNow(start, { addSuffix: false });
};

// Get relative time with custom thresholds
export const getRelativeTime = (dateString: string | null | undefined, thresholds: { 
    justNow?: number; 
    minutes?: number; 
    hours?: number; 
    days?: number; 
} = {}): string => {
    if (!dateString) return "N/A";

    const parsedDate = isNaN(Date.parse(dateString))
        ? parseISO(dateString)
        : new Date(dateString);

    if (!isValid(parsedDate)) {
        return "Invalid Date";
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - parsedDate.getTime()) / 1000);
    
    const { justNow = 30, minutes = 60, hours = 24, days = 7 } = thresholds;

    if (diffInSeconds < justNow) {
        return "Just now";
    } else if (diffInSeconds < minutes * 60) {
        const mins = Math.floor(diffInSeconds / 60);
        return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < hours * 60 * 60) {
        const hrs = Math.floor(diffInSeconds / (60 * 60));
        return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < days * 24 * 60 * 60) {
        const daysCount = Math.floor(diffInSeconds / (24 * 60 * 60));
        return `${daysCount} day${daysCount !== 1 ? 's' : ''} ago`;
    } else {
        return formatDistanceToNow(parsedDate, { addSuffix: true });
    }
};

// Format date for different contexts (e.g., tickets, logs, etc.)
export const formatContextualDate = (dateString: string | null | undefined, context: 'ticket' | 'log' | 'user' | 'general' = 'general'): string => {
    if (!dateString) return "N/A";

    const parsedDate = isNaN(Date.parse(dateString))
        ? parseISO(dateString)
        : new Date(dateString);

    if (!isValid(parsedDate)) {
        return "Invalid Date";
    }

    switch (context) {
        case 'ticket':
            return formatSmartDate(dateString, { includeTime: true, format: 'smart' });
        case 'log':
            return formatSmartDate(dateString, { includeTime: true, includeSeconds: true, format: 'compact' });
        case 'user':
            return formatSmartDate(dateString, { format: 'compact' });
        case 'general':
        default:
            return formatSmartDate(dateString, { includeTime: true, format: 'smart' });
    }
};

// Export the original formatDate function for backward compatibility
export { formatDate } from './formatDate';
export { timeAgo } from './timeAgo';

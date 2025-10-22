export interface TicketCategory {
    system_name: string;
    category_name: string;
    total: number;
}

export interface StatusCounts {
    're-open': number;
    closed: number;
    resubmitted: number;
    new_ticket: number;
    returned: number;
    cancelled: number;
    assigned: number;
    reminder: number;
    'follow-up': number;
}

export interface MonthlyStatusData extends StatusCounts {
    total: number;
    month_name: string;
}

export interface DailyStatusData extends StatusCounts {
    total: number;
    date_formatted: string;
    day_name?: string;
    is_weekend?: boolean;
}

export interface PerformanceMetrics {
    // LEGACY FIELDS FOR BACKWARD COMPATIBILITY
    query_execution_time_ms?: number;
    total_records_processed?: number;
    memory_usage_mb: number;
    optimization_benefit: string;
    detailed_daily_query_time_ms?: number;
    current_month_days?: number;
    previous_month_days?: number;
    total_daily_records?: number;

    // NEW ULTRA-FAST OPTIMIZATION FIELDS
    status_query_time_ms?: number;
    system_query_time_ms?: number;
    category_query_time_ms?: number;
    total_generation_time_ms?: number;
    optimization_level?: string;
    cache_duration_seconds?: number;
    cache_hit?: boolean;
    cache_key?: string;
    total_response_time_ms?: number;
    performance_benefit?: string;
}

export interface TicketSummaryData {
    status_counts: StatusCounts;
    total_tickets: number;
    system_counts: {
        [systemName: string]: number;
        total: number;
    };
    system_category_data: TicketCategory[];
    status_per_month: {
        [monthKey: string]: MonthlyStatusData;
    };
    previous_month_last_days: {
        [date: string]: DailyStatusData;
    };
    current_month_daily: {
        [date: string]: DailyStatusData;
    };
    previous_month_daily: {
        [date: string]: DailyStatusData;
    };
    total_months: number;
    performance_metrics: PerformanceMetrics;
    // LEGACY SUPPORT - OPTIONAL FOR BACKWARD COMPATIBILITY
    status_per_day?: {
        [date: string]: {
            're-open': number;
            closed: number;
            resubmitted: number;
            new_ticket: number;
            returned: number;
            cancelled: number;
            assigned: number;
            reminder: number;
            'follow-up': number;
            total: number;
        };
    };
    total_days?: number;
}
import { format, isValid, parseISO } from "date-fns";

// HELPER FUNCTION TO FORMAT DATE
export const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "N/A";

    const parsedDate = isNaN(Date.parse(dateString))
        ? parseISO(dateString)
        : new Date(dateString);

    if (!isValid(parsedDate)) {
        return "Invalid Date";
    }

    return format(parsedDate, "MMM. dd, yyyy hh:mm a");
};


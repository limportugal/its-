import { formatDistanceToNow } from "date-fns";

interface TimeAgo {
    (date: string | number | Date): string;
}

export const timeAgo: TimeAgo = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
};
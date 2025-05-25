import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isWithinInterval, subWeeks } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  const now = new Date()
  const oneWeekAgo = subWeeks(now, 1)

  if (isWithinInterval(date, { start: oneWeekAgo, end: now })) {
    return formatDistanceToNow(date, { addSuffix: true })
  }

  return format(date, "MMM d, yyyy")
}

import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  isPast,
} from "date-fns";

export const formatPostDate = (date?: Date) => {
  if (!date) {
    return null;
  }

  const now = new Date();

  if (isPast(date)) {
    const diffDays = differenceInDays(now, date);
    if (diffDays >= 7) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } else if (diffDays >= 1) {
      return `${diffDays}d ago`;
    }

    const diffHours = differenceInHours(now, date);
    if (diffHours >= 1) {
      return `${diffHours}h ago`;
    }

    const diffMinutes = differenceInMinutes(now, date);
    return `${diffMinutes}m ago`;
  } else {
    const diffDays = differenceInDays(date, now);
    if (diffDays >= 1) return `in ${diffDays}d`;
    const diffHours = differenceInHours(date, now);
    if (diffHours >= 1) return `in ${diffHours}h`;
    const diffMinutes = differenceInMinutes(date, now);
    return `in ${diffMinutes}m`;
  }
};

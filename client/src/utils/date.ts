import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  isPast,
} from "date-fns";

export const formatPostDate = (date?: Date): string | null => {
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

export const convertToVietnamTime = (utcDateString: string): Date => {
  return new Date(utcDateString);
};

export const formatVietnamDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

export const convertLocalToISOString = (localDateString: string): string => {
  if (!localDateString) {
    return "";
  }

  const date = new Date(localDateString);
  return date.toISOString();
};

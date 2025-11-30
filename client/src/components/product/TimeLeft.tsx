import { Clock } from "lucide-react";
import {
  format,
  formatDistanceToNowStrict,
  differenceInDays,
  isPast,
} from "date-fns";

interface TimeLeftProps {
  endDate: Date;
  viewMode?: string;
}

const TimeLeft = ({ endDate, viewMode = "grid" }: TimeLeftProps) => {
  let displayText: string;
  let urgent = false;

  const now = new Date();

  if (isPast(endDate)) {
    displayText = "Ended";
  } else {
    const diffDays = differenceInDays(endDate, now);
    if (diffDays < 3) {
      displayText = formatDistanceToNowStrict(endDate, { addSuffix: true });
      urgent = true;
    } else {
      displayText = format(endDate, "dd/MM/yyyy HH:mm");
    }
  }

  return (
    <div
      className={`flex gap-1 items-center text-gray-800 ${
        viewMode === "grid" ? "text-lg lg:text-xs" : "text-sm"
      } ${urgent && "text-red-500"}`}
    >
      <Clock
        className={`${viewMode === "grid" ? "size-5 lg:size-3" : "size-4"}`}
      />
      {displayText}
    </div>
  );
};

export default TimeLeft;

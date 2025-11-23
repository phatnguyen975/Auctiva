import { Clock } from "lucide-react";
import {
  format,
  formatDistanceToNowStrict,
  differenceInDays,
  isPast,
} from "date-fns";

const CountdownTimer = ({ endDate }: { endDate: Date }) => {
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
      className={`flex gap-1 text-xs items-center text-gray-800 ${
        urgent && "text-red-500"
      }`}
    >
      <Clock className="size-3" />
      {displayText}
    </div>
  );
};

export default CountdownTimer;

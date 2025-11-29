import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  endTime: Date;
  urgent?: boolean;
  compact?: boolean;
}

const calculateTimeLeft = (endTime: Date) => {
  const difference = endTime.getTime() - new Date().getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    ended: false,
  };
};

const CountdownTimer = ({
  endTime,
  urgent = false,
  compact = false,
}: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 24;
  const shouldBeRed = urgent || isUrgent;

  if (timeLeft.ended) {
    return (
      <div className="flex items-center gap-1 text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span className="text-sm">Ended</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div
        className={`flex items-center gap-1 ${
          shouldBeRed ? "text-red-500" : "text-gray-800"
        }`}
      >
        <Clock className="h-4 w-4" />
        <span className="text-sm font-medium">
          {timeLeft.days > 0
            ? `${timeLeft.days}d ${timeLeft.hours}h`
            : `${timeLeft.hours}h ${timeLeft.minutes}m`}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 ${
        shouldBeRed ? "text-red-500" : "text-gray-800"
      }`}
    >
      <Clock className="h-5 w-5" />
      <div className="flex gap-1">
        {timeLeft.days > 0 && (
          <span className="font-semibold">
            {timeLeft.days}d {timeLeft.hours}h
          </span>
        )}
        {timeLeft.days === 0 && (
          <span className="font-semibold">
            {timeLeft.hours.toString().padStart(2, "0")}:
            {timeLeft.minutes.toString().padStart(2, "0")}:
            {timeLeft.seconds.toString().padStart(2, "0")}
          </span>
        )}
      </div>
    </div>
  );
};

export default CountdownTimer;

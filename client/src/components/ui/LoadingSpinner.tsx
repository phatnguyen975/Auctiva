import { Loader2 } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <Loader2
      className="size-10 animate-spin text-cyan-600 rounded-full"
      strokeWidth={1.5}
    />
  );
};

export default LoadingSpinner;

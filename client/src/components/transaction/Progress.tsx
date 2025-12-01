import { CreditCard, CheckCircle2, Truck, Star } from "lucide-react";

const STEPS = [
  { number: 1, title: "Payment & Shipping", icon: CreditCard },
  { number: 2, title: "Confirmation", icon: CheckCircle2 },
  { number: 3, title: "Delivery", icon: Truck },
  { number: 4, title: "Rating", icon: Star },
];

interface ProgressProps {
  currentStep: number;
  className?: string;
}

const Progress = ({ currentStep, className = "" }: ProgressProps) => {
  const progressPercentage = Math.min(
    100,
    Math.max(0, (currentStep / STEPS.length) * 100)
  );

  console.log(progressPercentage);

  return (
    <div className={`w-full ${className}`}>
      {/* 1. Thanh Progress Bar */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-black/20 mb-6">
        <div
          className="h-full bg-black transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* 2. Danh sách các bước (Steps Grid) */}
      <div className="grid grid-cols-4 gap-2">
        {STEPS.map((step) => {
          const StepIcon = step.icon;
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          // Xử lý màu sắc bằng chuỗi điều kiện
          let textClass = "text-muted-foreground";
          let borderClass = "border-muted";
          let bgClass = "bg-transparent";

          if (isCurrent) {
            textClass = "text-primary";
            borderClass = "border-primary";
            bgClass = "bg-primary/10";
          } else if (isCompleted) {
            textClass = "text-green-600";
            borderClass = "border-green-600";
            bgClass = "bg-green-50";
          }

          return (
            <div
              key={step.number}
              className={`flex flex-col items-center gap-2 ${textClass}`}
            >
              {/* Vòng tròn Icon */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-300 ${borderClass} ${bgClass}`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <StepIcon className="h-5 w-5" />
                )}
              </div>

              {/* Tên bước */}
              <span className="text-xs text-center hidden sm:block font-medium">
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Progress;

import type { ReactNode } from "react";

interface TooltipProps {
  children: ReactNode;
  content: string;
}

const Tooltip = ({ children, content }: TooltipProps) => {
  return (
    <div className="group relative flex items-center w-fit">
      {children}

      <div
        className="absolute bottom-full left-1/2 mb-2 w-max max-w-[250px] -translate-x-1/2 px-3 py-1.5 
                      bg-gray-900 text-white text-xs rounded-md shadow-lg 
                      opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                      transition-all duration-200 ease-out z-50 pointer-events-none whitespace-normal text-center"
      >
        {content}

        <div className="absolute top-full left-1/2 -mt-1 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
};

export default Tooltip;

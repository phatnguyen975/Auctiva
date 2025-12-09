import { Menu } from "lucide-react";
import { useState } from "react";
import { X } from "lucide-react";

import DesktopDashboardSidebar from "./DesktopDashboardSidebar";

const MobileDashboardSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <button
        className="flex gap-2 items-center px-3 font-medium py-1 bg-white rounded-lg border border-gray-300 cursor-pointer"
        onClick={() => setSidebarOpen((prev) => !prev)}
      >
        <Menu className="size-4" />
        Menu
      </button>

      {sidebarOpen && (
        <>
          <div
            className={`
              fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-all duration-300 ease-in-out
              ${sidebarOpen ? "visible opacity-100" : "invisible opacity-0"}
            `}
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />

          <div
            className={`
              fixed inset-y-0 left-0 z-50 h-full w-[300px] sm:w-[350px] 
              bg-[hsl(var(--background))] border-r shadow-2xl 
              transition-transform duration-300 ease-in-out
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}
          >
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>

            {/* Nội dung chính của Sidebar */}
            <div className="h-full py-6 px-6 overflow-y-auto">
              <DesktopDashboardSidebar isDesktop={false} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MobileDashboardSidebar;

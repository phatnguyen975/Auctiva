import { Menu } from "lucide-react";
import { useState } from "react";

const MobileDashboardSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="lg:hidden mb-4">
      <button
        className="flex gap-2 items-center px-3 font-medium py-1 bg-white rounded-lg border border-gray-300 cursor-pointer"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="size-4" />
        Menu
      </button>

      {sidebarOpen && (
        <div>
          Mobile Sidebar
        </div>
      )}
    </div>
  );
};

export default MobileDashboardSidebar;

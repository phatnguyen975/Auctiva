import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import MobileDashboardSidebar from "../components/dashboard/MobileDashboardSidebar";
import DesktopDashboardSidebar from "../components/dashboard/DesktopDashboardSidebar";

const DashboardLayout = () => {
  return (
    <>
      <Header isDashboard={true} />

      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-4 lg:py-8">
          <MobileDashboardSidebar />
          <div className="flex gap-4 lg:gap-6">
            <DesktopDashboardSidebar />
            <main className="flex-1 min-w-0">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;

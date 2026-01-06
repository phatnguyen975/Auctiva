import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Pencil,
  Star,
  Clock,
  AlertTriangle,
  User,
  Settings,
  Heart,
  Gavel,
  Trophy,
  TrendingUp,
  ShoppingBag,
  Package,
  PackageCheck,
  LayoutDashboard,
  FolderTree,
  Users,
  CheckCircle,
  UserCog,
} from "lucide-react";
import { assets, dumpyWatchist, dumpyMyBids } from "../../assets/assets";
import type { RootState } from "../../store/store";
import { axiosInstance } from "../../lib/axios";

interface DesktopDashboardSidebarProps {
  isDesktop?: boolean;
}

const DesktopDashboardSidebar = ({
  isDesktop = true,
}: DesktopDashboardSidebarProps) => {
  const authUser = useSelector((state: RootState) => state.auth.authUser);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  let currentTabId = pathSegments[pathSegments.length - 1] || "profile";

  if (currentTabId === "admin" || currentTabId === "dashboard") {
    currentTabId = "profile";
  } else if (currentTabId === "seller") {
    currentTabId = "overview";
  }

  const [activeTab, setActiveTab] = useState(currentTabId);
  const [activeCount, setActiveCount] = useState<number | null>(null);
  const [soldCount, setSoldCount] = useState<number | null>(null);
  const [sellerExpiredAt, setSellerExpiredAt] = useState<Date | null>(null);

  const [avatarUrl, setAvatarUrl] = useState<string>(assets.avatar);

  const navigate = useNavigate();

  // Detect current context: admin panel, seller studio, or user dashboard
  const isAdminPanel = location.pathname.startsWith("/admin");
  const isSellerStudio = location.pathname.startsWith("/seller");

  // Avatar upload handler
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTabClick = (
    tab: string,
    context: "admin" | "seller" | "user" = "user"
  ) => {
    setActiveTab(tab);
    if (context === "admin") {
      navigate(`/admin/${tab}`);
    } else if (context === "seller") {
      navigate(`/seller/${tab}`);
    } else {
      navigate(`/dashboard/${tab}`);
    }
  };

  const formatExpiryTime = () => {
    if (!sellerExpiredAt) return "N/A";

    const diff = sellerExpiredAt.getTime() - Date.now();

    console.log("Expiry diff (ms):", diff);

    if (diff <= 0) {
      return "00:00:00";
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days} Day${days > 1 ? "s" : ""} Remaining`;
    } else {
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
  };

  const watchlistCount = dumpyWatchist.length;
  const myBidsCount = dumpyMyBids.length;

  const isExpiryUrgent = sellerExpiredAt
    ? sellerExpiredAt.getTime() - Date.now() < 24 * 60 * 60 * 1000
    : false;

  // User Dashboard tabs (for both bidder and seller when on /dashboard/*)
  const userDashboardTabs = [
    {
      id: "profile",
      label: "Profile Overview",
      icon: User,
    },
    {
      id: "settings",
      label: "Account Settings",
      icon: Settings,
    },
    {
      id: "watchlist",
      label: "Watchlist",
      icon: Heart,
      count: watchlistCount,
    },
    {
      id: "my-bids",
      label: "My Bids",
      icon: Gavel,
      count: myBidsCount,
    },
    {
      id: "won-auctions",
      label: "Won Auctions",
      icon: Trophy,
    },
  ];

  // Upgrade to Seller tab (only for bidders on /dashboard/*)
  const upgradeToSellerTab = {
    id: "upgrade",
    label: "Upgrade to Seller",
    icon: TrendingUp,
  };

  // Seller Studio tabs (only on /seller/*)
  const sellerStudioTabs = [
    {
      id: "overview",
      label: "Dashboard",
      icon: ShoppingBag,
    },
    {
      id: "create",
      label: "Create Listing",
      icon: Package,
    },
    {
      id: "active",
      label: "Active Listings",
      icon: Package,
      count: activeCount,
    },
    {
      id: "sold",
      label: "Sold Items",
      icon: PackageCheck,
      count: soldCount,
    },
  ];

  // Admin Panel tabs (only on /admin/*)
  const adminPanelTabs = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
    },
    {
      id: "categories",
      label: "Categories",
      icon: FolderTree,
    },
    {
      id: "users",
      label: "Manage Users",
      icon: Users,
    },
    {
      id: "products",
      label: "All Products",
      icon: Package,
    },
    {
      id: "approvals",
      label: "Seller Approvals",
      icon: CheckCircle,
      count: 3, // Mock pending approvals count
    },
    {
      id: "settings",
      label: "System Settings",
      icon: UserCog,
    },
  ];

  const calculateUserRating = () => {
    const ratingCount = authUser?.profile?.rating_count;
    const ratingPositive = authUser?.profile?.rating_positive;

    if (!ratingCount || !ratingPositive || ratingCount === 0) {
      return 0;
    }

    return ((ratingPositive / ratingCount) * 100).toFixed(1);
  };

  const userData = {
    username: authUser?.profile?.user_name,
    fullName: authUser?.profile?.full_name,
    email: authUser?.profile?.email,
    address: authUser?.profile?.address,
    dateOfBirth: authUser?.profile?.birth_date,
    avatarUrl: authUser?.profile?.avatar_url || "",
    rating: calculateUserRating(),
    role: authUser?.profile?.role,
    auctionsWon: 45, // Mock
    bidsPlaced: 127, // Mock
  };

  // Determine which tabs to show based on current route
  const mainTabs = isAdminPanel
    ? adminPanelTabs
    : isSellerStudio
    ? sellerStudioTabs
    : userDashboardTabs;

  // Show "Upgrade to Seller" only for bidders on user dashboard
  const shouldShowUpgradeTab =
    !isSellerStudio && !isAdminPanel && userData.role === "bidder";
  const additionalTabs = shouldShowUpgradeTab ? [upgradeToSellerTab] : [];

  const fetchSellerAnalysis = async () => {
    try {
      const { data } = await axiosInstance.get("/products/analysis", {
        headers: {
          "x-api-key": import.meta.env.VITE_API_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (data.success) {
        setActiveCount(data.data.activeCount);
        setSoldCount(data.data.soldCount);
      }
    } catch (error: any) {
      console.error("Error fetching analysis:", error.message);
    }
  };

  const fetchSellerPermission = async () => {
    try {
      const { data } = await axiosInstance.get(
        "/seller-upgrade-requests/permission",
        {
          headers: {
            "x-api-key": import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (data.success && data.data?.expiredAt) {
        setSellerExpiredAt(new Date(data.data.expiredAt));
      }
    } catch (error: any) {
      console.error("Error fetching seller permission:", error.message);
    }
  };

  useEffect(() => {
    if (isSellerStudio) {
      fetchSellerAnalysis();
    }

    if (userData.role === "seller" && !isSellerStudio && !isAdminPanel) {
      fetchSellerPermission();
    }
  }, [location, userData.role]);

  console.log(sellerExpiredAt);

  return (
    <>
      <div
        className={`
          rounded-lg sticky top-24
          ${isDesktop ? "p-4 xl:p-6" : "p-2"} 
        `}
      >
        <div
          className={`
            ${isDesktop ? "space-y-4 xl:space-y-6" : "space-y-2"}
          `}
        >
          {/* Admin Panel Header (only for /admin/*) */}
          {isAdminPanel && (
            <div className="mb-6">
              <h3 className="font-bold flex items-center gap-2 mb-2">
                <LayoutDashboard className="h-5 w-5 text-primary" />
                Admin Panel
              </h3>
              <p className="text-xs text-muted-foreground">
                Manage platform settings and users
              </p>
            </div>
          )}

          {/* Seller Studio Header (only for /seller/*) */}
          {isSellerStudio && (
            <div className="mb-6">
              <h3 className="font-bold flex items-center gap-2 mb-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Seller Studio
              </h3>
              <p className="text-xs text-muted-foreground">
                Manage your listings and sales
              </p>
            </div>
          )}

          {/* User Profile Summary (only for /dashboard/*) */}
          {!isSellerStudio && !isAdminPanel && (
            <>
              <div className="text-center pb-6 border-b">
                <div className="relative inline-block mb-4">
                  <img
                    src={userData.avatarUrl || assets.avatar}
                    alt="Avatar"
                    className="w-20 h-20 lg:w-24 lg:h-24 rounded-full object-cover mx-auto border-4 border-black/10"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-black text-white rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors shadow-lg"
                  >
                    <Pencil className="h-3 w-3 lg:h-3.5 lg:w-3.5" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <h3 className="font-bold mb-1">
                  {userData.fullName || userData.username}
                </h3>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-lg text-amber-600">
                    {userData.rating}%
                  </span>
                </div>
                <span
                  className="inline-flex items-center bg-gray-200 justify-center rounded-lg px-2 py-1 text-xm font-medium w-fit whitespace-nowrap 
                  text-primary border-primary shrink-0 gap-1"
                >
                  {userData.role === "seller" ? "Seller" : "Bidder"}
                </span>
              </div>

              {/* Seller Status Widget (only for sellers with expiredAt on /dashboard/*) */}
              {userData.role === "seller" && sellerExpiredAt && (
                <div
                  className={`p-4 mt-4 lg:p-5 lg:mt-0 rounded-lg border-2 ${
                    isExpiryUrgent
                      ? "bg-destructive/10 border-destructive"
                      : "bg-primary/10 border-primary"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Clock
                      className={`h-4 w-4 ${
                        isExpiryUrgent ? "text-destructive" : "text-primary"
                      }`}
                    />
                    <span className="text-xs font-medium">
                      Seller Privileges
                    </span>
                    <div className="group relative ml-auto flex items-center justify-center">
                      <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      <div
                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 w-max max-w-xs 
                  scale-0 opacity-0 transition-all duration-200 
                  group-hover:scale-100 group-hover:opacity-100 origin-bottom"
                      >
                        <div className="bg-black text-white rounded-md px-3 py-1.5 text-xs shadow-md text-center">
                          <p>
                            You can manage existing listings after expiry, but
                            cannot create new ones.
                          </p>
                        </div>

                        <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-primary rotate-45"></div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-base lg:text-lg font-bold ${
                      isExpiryUrgent ? "text-destructive" : "text-primary"
                    }`}
                  >
                    {formatExpiryTime()}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Navigation Menu */}
          <nav className="space-y-1">
            <div className="flex flex-col gap-1 w-full">
              {mainTabs.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() =>
                      handleTabClick(
                        item.id,
                        isAdminPanel
                          ? "admin"
                          : isSellerStudio
                          ? "seller"
                          : "user"
                      )
                    }
                    className={`
                      group flex w-full items-center rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer
                      ${
                        isActive
                          ? "bg-slate-900 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                      }
                    `}
                  >
                    <Icon className="mr-2 h-4 w-4" />

                    {item.label}

                    {/* {item.count !== undefined && (
                      <span
                        className={`
                          ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs
                          ${
                            isActive
                              ? "bg-white/20 text-white"
                              : item.id === "approvals" && isAdminPanel
                              ? "bg-red-500 text-white"
                              : "bg-slate-200 text-slate-900"
                          }
                        `}
                      >
                        {item.count}
                      </span>
                    )} */}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Additional Tabs (Upgrade to Seller for bidders) */}
          {additionalTabs.length > 0 && (
            <>
              <div className="my-2 border-t pt-2" />

              <div className="flex flex-col gap-1 w-full">
                {additionalTabs.map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id, "user")}
                      className={`
                        group flex w-full items-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-200 hover:cursor-pointer
                        ${
                          isActive
                            ? "bg-slate-900 text-white shadow-sm"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }
                      `}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DesktopDashboardSidebar;

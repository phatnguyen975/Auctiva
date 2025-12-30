import { useNavigate } from "react-router-dom";
import { Package, PackageCheck, Star, Clock, Plus } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SellerOverviewPage = () => {
  const navigate = useNavigate();

  // Mock data
  const userData = {
    rating: 98.5,
  };

  const activeListings = [{ id: "1" }, { id: "2" }];

  const soldItems = [{ id: "1" }, { id: "2" }];

  const sellerPrivilegesExpiry = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days remaining

  const last7DaysData = [
    { day: "Mon", activeListings: 8, soldItems: 3, rating: 97.5 },
    { day: "Tue", activeListings: 10, soldItems: 2, rating: 97.8 },
    { day: "Wed", activeListings: 7, soldItems: 4, rating: 98.0 },
    { day: "Thu", activeListings: 9, soldItems: 3, rating: 98.2 },
    { day: "Fri", activeListings: 11, soldItems: 5, rating: 98.5 },
    { day: "Sat", activeListings: 6, soldItems: 2, rating: 98.3 },
    {
      day: "Sun",
      activeListings: activeListings.length,
      soldItems: soldItems.length,
      rating: userData.rating,
    },
  ];

  const formatExpiryTime = () => {
    const diff = sellerPrivilegesExpiry.getTime() - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `${days} Day${days > 1 ? "s" : ""} Remaining`;
    } else {
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Seller Studio</h2>
        <p className="text-[hsl(var(--muted-foreground))]">
          Manage your seller account
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Listings Card */}
        <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] flex flex-col gap-6 rounded-xl border border-[hsl(var(--border))] transition-colors duration-300 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-[hsl(var(--primary)/0.1)] p-3 rounded-lg">
              <Package className="h-6 w-6 text-[hsl(var(--primary))]" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">{activeListings.length}</p>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Active Listings
          </p>
        </div>

        {/* Sold Items Card */}
        <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] flex flex-col gap-6 rounded-xl border border-[hsl(var(--border))] transition-colors duration-300 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500/10 p-3 rounded-lg">
              <PackageCheck className="h-6 w-6 text-green-600 dark:text-green-500" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">{soldItems.length}</p>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Sold Items
          </p>
        </div>

        {/* Seller Rating Card */}
        <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] flex flex-col gap-6 rounded-xl border border-[hsl(var(--border))] transition-colors duration-300 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-amber-500/10 p-3 rounded-lg">
              <Star className="h-6 w-6 text-amber-500" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">{userData.rating}%</p>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Seller Rating
          </p>
        </div>

        {/* Days Remaining Card */}
        <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] flex flex-col gap-6 rounded-xl border border-[hsl(var(--border))] transition-colors duration-300 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-[hsl(var(--secondary)/0.1)] p-3 rounded-lg">
              <Clock className="h-6 w-6 text-[hsl(var(--secondary-foreground))]" />
            </div>
          </div>
          <p className="text-xl font-bold mb-1">
            {formatExpiryTime().split(" ")[0]}
          </p>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Days Remaining
          </p>
        </div>
      </div>

      {/* 7-Day Performance Chart */}
      <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] flex flex-col gap-6 rounded-xl border border-[hsl(var(--border))] transition-colors duration-300 p-6">
        <h3 className="text-xl font-semibold mb-6">7-Day Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={last7DaysData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="activeListings"
              stroke="#2563EB"
              strokeWidth={2}
              name="Active Listings"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="soldItems"
              stroke="#16A34A"
              strokeWidth={2}
              name="Sold Items"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="rating"
              stroke="#F59E0B"
              strokeWidth={2}
              name="Rating %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Create New Listing Button */}
          <button
            onClick={() => navigate("/seller/create-listing")}
            className="h-16 flex flex-col items-center justify-center py-3 gap-2 bg-slate-900 text-white shadow-sm whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none focus-visible:ring-[hsl(var(--ring)/0.5)] focus-visible:ring-[3px] hover:bg-[hsl(var(--primary)/0.9)] hover:cursor-pointer"
          >
            <Plus className="h-5 w-5 mb-1" />
            Create New Listing
          </button>

          {/* View Active Listings Button */}
          <button
            onClick={() => navigate("/dashboard/seller/active-listings")}
            className="h-16 flex flex-col items-center justify-center py-3 gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none focus-visible:ring-[hsl(var(--ring)/0.5)] focus-visible:ring-[3px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--primary)/0.9)] hover:text-[hsl(var(--accent-foreground))] dark:bg-[hsl(var(--input)/0.3)] dark:border-[hsl(var(--input))] dark:hover:bg-[hsl(var(--input)/0.5)] hover:cursor-pointer"
          >
            <Package className="h-5 w-5 mb-1" />
            View Active Listings
          </button>

          {/* Manage Sold Items Button */}
          <button
            onClick={() => navigate("/dashboard/seller/sold-items")}
            className="h-16 flex flex-col items-center justify-center py-3 gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none focus-visible:ring-[hsl(var(--ring)/0.5)] focus-visible:ring-[3px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--primary)/0.9)] hover:text-[hsl(var(--accent-foreground))] dark:bg-[hsl(var(--input)/0.3)] dark:border-[hsl(var(--input))] dark:hover:bg-[hsl(var(--input)/0.5)] hover:cursor-pointer"
          >
            <PackageCheck className="h-5 w-5 mb-1" />
            Manage Sold Items
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerOverviewPage;

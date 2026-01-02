import {
  Package,
  TrendingUp,
  DollarSign,
  Eye,
  Heart,
  Gavel,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SellerOverviewPage = () => {
  // Mock data - Stats
  const stats = {
    activeListings: 12,
    totalSales: 156,
    revenue: 45230,
    avgRating: 4.8,
  };

  // Mock data - Performance over 7 days
  const performanceData = [
    { day: "Mon", views: 245, bids: 34, revenue: 1200, watchers: 89 },
    { day: "Tue", views: 312, bids: 45, revenue: 1850, watchers: 102 },
    { day: "Wed", views: 189, bids: 28, revenue: 980, watchers: 76 },
    { day: "Thu", views: 401, bids: 56, revenue: 2340, watchers: 134 },
    { day: "Fri", views: 278, bids: 41, revenue: 1560, watchers: 95 },
    { day: "Sat", views: 356, bids: 52, revenue: 2100, watchers: 118 },
    { day: "Sun", views: 298, bids: 38, revenue: 1420, watchers: 104 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">Dashboard Overview</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Listings Card */}
        <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-xl border border-[hsl(var(--border))] transition-colors duration-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Active Listings
              </p>
              <p className="text-3xl font-bold mt-1">{stats.activeListings}</p>
            </div>
            <div className="bg-[hsl(var(--primary)/0.1)] p-3 rounded-lg">
              <Package className="h-6 w-6 text-[hsl(var(--primary))]" />
            </div>
          </div>
        </div>

        {/* Total Sales Card */}
        <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-xl border border-[hsl(var(--border))] transition-colors duration-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Total Sales
              </p>
              <p className="text-3xl font-bold mt-1">{stats.totalSales}</p>
            </div>
            <div className="bg-green-500/10 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-xl border border-[hsl(var(--border))] transition-colors duration-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Revenue
              </p>
              <p className="text-3xl font-bold mt-1">
                ${stats.revenue.toLocaleString()}
              </p>
            </div>
            <div className="bg-amber-500/10 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-amber-500" />
            </div>
          </div>
        </div>

        {/* Avg Rating Card */}
        {/* <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-xl border border-[hsl(var(--border))] transition-colors duration-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Avg Rating
              </p>
              <p className="text-3xl font-bold mt-1">{stats.avgRating}/5</p>
            </div>
            <div className="bg-[hsl(var(--secondary)/0.1)] p-3 rounded-lg">
              <ThumbsUp className="h-6 w-6 text-[hsl(var(--secondary-foreground))]" />
            </div>
          </div>
        </div> */}
      </div>

      {/* 7-Day Performance Chart */}
      <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-xl border border-[hsl(var(--border))] transition-colors duration-300 p-6">
        <h3 className="font-semibold mb-4">7-Day Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={performanceData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="bids" stroke="#82ca9d" />
            <Line type="monotone" dataKey="revenue" stroke="#FF8C00" />
            <Line type="monotone" dataKey="watchers" stroke="#FF00FF" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 7-Day Performance Charts - Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views & Watchers Chart */}
        <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-xl border border-[hsl(var(--border))] transition-colors duration-300 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Views & Watchers</h3>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-[#2563EB]" />
              <Heart className="h-4 w-4 text-[#EC4899]" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart
              data={performanceData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorWatchers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EC4899" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#EC4899" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-[hsl(var(--muted))]"
              />
              <XAxis
                dataKey="day"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#2563EB"
                fillOpacity={1}
                fill="url(#colorViews)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="watchers"
                stroke="#EC4899"
                fillOpacity={1}
                fill="url(#colorWatchers)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bids & Revenue Chart */}
        <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-xl border border-[hsl(var(--border))] transition-colors duration-300 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Bids & Revenue</h3>
            <div className="flex items-center gap-2">
              <Gavel className="h-4 w-4 text-[#10B981]" />
              <DollarSign className="h-4 w-4 text-[#F59E0B]" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart
              data={performanceData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-[hsl(var(--muted))]"
              />
              <XAxis
                dataKey="day"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                yAxisId="left"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="bids"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: "#10B981", r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#F59E0B"
                strokeWidth={3}
                dot={{ fill: "#F59E0B", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SellerOverviewPage;

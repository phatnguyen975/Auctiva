import { useNavigate } from "react-router-dom";
import { Plus, Package, Eye, Edit } from "lucide-react";

const ActiveListingsPage = () => {
  const navigate = useNavigate();

  // Mock data
  //const activeListings: any[] = [];
  const activeListings = [
    {
      id: "1",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
      title: "Premium Headphones",
      currentBid: 245,
      timeLeft: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      totalBids: 23,
    },
    {
      id: "2",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop",
      title: "Luxury Watch",
      currentBid: 890,
      timeLeft: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      totalBids: 45,
    },
  ];

  const formatTimeLeft = (endTime: Date) => {
    const diff = endTime.getTime() - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Active Listings</h2>
          <p className="text-[hsl(var(--muted-foreground))]">
            Your current auction listings
          </p>
        </div>
        <button
          onClick={() => navigate("/seller/create")}
          className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white shadow-sm whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none focus-visible:ring-[hsl(var(--ring)/0.5)] focus-visible:ring-[3px] hover:bg-[hsl(var(--primary)/0.9)] h-9 px-4 py-2 hover:cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Create New
        </button>
      </div>

      {/* Content */}
      {activeListings.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-16 w-16 text-[hsl(var(--muted-foreground))] mx-auto mb-4 opacity-20" />
          <h3 className="text-xl font-semibold mb-2">No active listings</h3>
          <p className="text-[hsl(var(--muted-foreground))] mb-6">
            Create your first listing to start selling
          </p>
          <button
            onClick={() => navigate("/dashboard/seller/create-listing")}
            className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white shadow-sm whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none focus-visible:ring-[hsl(var(--ring)/0.5)] focus-visible:ring-[3px] hover:bg-[hsl(var(--primary)/0.9)] h-9 px-4 py-2 hover:cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create Listing
          </button>
        </div>
      ) : (
        <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-xl border border-[hsl(var(--border))] transition-colors duration-300">
          <div className="w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="border-b border-[hsl(var(--border))]">
                <tr className="border-b border-[hsl(var(--border))] transition-colors hover:bg-[hsl(var(--muted)/0.5)]">
                  <th className="h-12 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
                    Product
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
                    Current Bid
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
                    Bids
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
                    Time Left
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {activeListings.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[hsl(var(--border))] transition-colors hover:bg-[hsl(var(--muted)/0.5)]"
                  >
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <span className="font-medium">{item.title}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle font-bold text-[hsl(var(--primary))]">
                      ${item.currentBid.toLocaleString()}
                    </td>
                    <td className="p-4 align-middle">{item.totalBids}</td>
                    <td className="p-4 align-middle">
                      {formatTimeLeft(item.timeLeft)}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/products/${item.id}`)}
                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none focus-visible:ring-[hsl(var(--ring)/0.5)] focus-visible:ring-[3px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] hover:cursor-pointer h-8 px-3"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/seller/update/${item.id}`)}
                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none focus-visible:ring-[hsl(var(--ring)/0.5)] focus-visible:ring-[3px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] hover:cursor-pointer h-8 px-3"
                        >
                          <Edit className="h-4 w-4 text-[hsl(var(--destructive))]" />
                          Edit
                        </button>
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none focus-visible:ring-[hsl(var(--ring)/0.5)] focus-visible:ring-[3px] bg-[hsl(var(--destructive))] text-white hover:bg-[hsl(var(--destructive)/0.9)] hover:cursor-pointer h-8 px-3">
                          End Early
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveListingsPage;

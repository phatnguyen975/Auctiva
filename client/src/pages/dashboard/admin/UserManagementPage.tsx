import { useState, useEffect } from "react";
import { Eye, Ban, Loader2, Search } from "lucide-react";
import { axiosInstance } from "../../../lib/axios";

// Types
interface User {
  id: string;
  username: string;
  email: string;
  role: "bidder" | "seller" | "admin";
  rating: number;
  joinDate: string;
  status: "active" | "suspended" | "banned";
}

const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      username: "john_doe",
      email: "john@email.com",
      role: "bidder",
      rating: 95.5,
      joinDate: "2024-06-15",
      status: "active",
    },
    {
      id: "2",
      username: "tech_seller",
      email: "tech@email.com",
      role: "seller",
      rating: 98.2,
      joinDate: "2024-03-10",
      status: "active",
    },
    {
      id: "3",
      username: "sarah_m",
      email: "sarah@email.com",
      role: "bidder",
      rating: 87.3,
      joinDate: "2024-08-22",
      status: "active",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // ============ API CALLS ============

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axiosInstance.get("/api/admin/users", {
        params: {
          search: searchQuery || undefined,
        },
      });

      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  // Suspend/Unsuspend user
  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    const action = newStatus === "suspended" ? "suspend" : "unsuspend";

    if (
      !confirm(
        `Are you sure you want to ${action} this user? ${
          newStatus === "suspended"
            ? "They will not be able to access the platform."
            : "They will regain access to the platform."
        }`
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await axiosInstance.patch(
        `/api/admin/users/${userId}/status`,
        {
          status: newStatus,
        }
      );

      if (response.data.success) {
        alert(`User ${action}ed successfully!`);
        // Refresh users list
        await fetchUsers();
      }
    } catch (err: any) {
      console.error(`Error ${action}ing user:`, err);
      setError(err.response?.data?.message || `Failed to ${action} user`);
      alert(
        "Error: " + (err.response?.data?.message || `Failed to ${action} user`)
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Ban user permanently
  const banUser = async (userId: string) => {
    if (
      !confirm(
        "Are you sure you want to permanently ban this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await axiosInstance.delete(`/api/admin/users/${userId}`);

      if (response.data.success) {
        alert("User banned successfully!");
        // Refresh users list
        await fetchUsers();
      }
    } catch (err: any) {
      console.error("Error banning user:", err);
      setError(err.response?.data?.message || "Failed to ban user");
      alert("Error: " + (err.response?.data?.message || "Failed to ban user"));
    } finally {
      setIsLoading(false);
    }
  };

  // Get user details
  const getUserDetails = async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axiosInstance.get(`/api/admin/users/${userId}`);

      if (response.data.success) {
        setSelectedUser(response.data.data);
        setIsViewDialogOpen(true);
      }
    } catch (err: any) {
      console.error("Error fetching user details:", err);
      setError(err.response?.data?.message || "Failed to fetch user details");
      alert(
        "Error: " +
          (err.response?.data?.message || "Failed to fetch user details")
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    // Uncomment when API is ready
    // fetchUsers();
  }, []);

  // ============ HANDLERS ============

  const handleSearch = () => {
    fetchUsers();
  };

  const handleViewUser = (user: User) => {
    // For now, use local data. When API is ready, call getUserDetails(user.id)
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const handleToggleStatus = (userId: string, currentStatus: string) => {
    toggleUserStatus(userId, currentStatus);
  };

  const handleBanUser = (userId: string) => {
    banUser(userId);
  };

  // Filter users based on search query (client-side filtering for demo)
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl lg:text-3xl font-bold">User Management</h2>

        {/* Search */}
        <div className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            <input
              type="text"
              placeholder="Search by username or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex h-10 w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-white hover:bg-slate-900/90 h-10 px-4 py-2 cursor-pointer"
          >
            Search
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-xl border border-[hsl(var(--border))] overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--muted-foreground))]" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-[hsl(var(--muted-foreground))]">
            <p>No users found.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[hsl(var(--border))]">
                <th className="h-12 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
                  Username
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
                  Email
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
                  Role
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
                  Rating
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
                  Join Date
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
                  Status
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-[hsl(var(--border))] transition-colors hover:bg-[hsl(var(--muted)/0.5)]"
                >
                  <td className="p-4 align-middle font-medium">
                    {user.username}
                  </td>
                  <td className="p-4 align-middle">{user.email}</td>
                  <td className="p-4 align-middle">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.role === "seller"
                          ? "bg-slate-900 text-white"
                          : user.role === "admin"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                          : "bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 align-middle">{user.rating}%</td>
                  <td className="p-4 align-middle">{user.joinDate}</td>
                  <td className="p-4 align-middle">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.status === "active"
                          ? "bg-slate-900 text-white"
                          : user.status === "suspended"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewUser(user)}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] h-9 px-3 cursor-pointer"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user.id, user.status)}
                        disabled={isLoading || user.status === "banned"}
                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 cursor-pointer ${
                          user.status === "active"
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-green-500 text-white hover:bg-green-600"
                        }`}
                      >
                        <Ban className="h-4 w-4 mr-1" />
                        {user.status === "active" ? "Suspend" : "Unsuspend"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* View User Dialog */}
      {isViewDialogOpen && selectedUser && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setIsViewDialogOpen(false)}
        >
          <div
            className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-lg shadow-lg w-full max-w-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">User Details</h3>
                <button
                  onClick={() => setIsViewDialogOpen(false)}
                  className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors hover:cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Username
                    </p>
                    <p className="font-medium">{selectedUser.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Email
                    </p>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Role
                    </p>
                    <p className="font-medium capitalize">
                      {selectedUser.role}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Rating
                    </p>
                    <p className="font-medium">{selectedUser.rating}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Join Date
                    </p>
                    <p className="font-medium">{selectedUser.joinDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Status
                    </p>
                    <p className="font-medium capitalize">
                      {selectedUser.status}
                    </p>
                  </div>
                </div>

                {/* Additional user stats can be added here */}
                <div className="pt-4 border-t border-[hsl(var(--border))]">
                  <h4 className="font-semibold mb-3">Actions</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        handleToggleStatus(
                          selectedUser.id,
                          selectedUser.status
                        );
                        setIsViewDialogOpen(false);
                      }}
                      disabled={isLoading || selectedUser.status === "banned"}
                      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 cursor-pointer ${
                        selectedUser.status === "active"
                          ? "bg-amber-500 text-white hover:bg-amber-600"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      {selectedUser.status === "active"
                        ? "Suspend User"
                        : "Unsuspend User"}
                    </button>
                    <button
                      onClick={() => {
                        handleBanUser(selectedUser.id);
                        setIsViewDialogOpen(false);
                      }}
                      disabled={isLoading}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-500 text-white hover:bg-red-600 h-10 px-4 py-2 cursor-pointer"
                    >
                      Ban User Permanently
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setIsViewDialogOpen(false)}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] h-10 px-4 py-2 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;

import { useState, useEffect } from "react";
import { Eye, Search, Trash2, User, X } from "lucide-react";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";

interface User {
  id: string;
  username: string | null;
  fullName: string;
  email: string;
  address: string | null;
  role: "bidder" | "seller" | "admin";
  ratingPositive: number | null;
  ratingCount: number | null;
  createdAt: string;
}

const UserManagementPage = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const calculateUserRating = (user: User) => {
    const ratingCount = user.ratingCount;
    const ratingPositive = user.ratingPositive;

    if (!ratingCount || !ratingPositive || ratingCount === 0) {
      return 0;
    }

    return ((ratingPositive / ratingCount) * 100).toFixed(1);
  };

  // ============ API CALLS ============

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data } = await axiosInstance.get("/users", {
        params: {
          keyword: searchQuery || undefined,
        },
        headers: {
          "x-api-key": import.meta.env.VITE_API_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (data.success) {
        setUsers(data.data);
      }
    } catch (error: any) {
      console.error("Error fetching users:", error);
      setError(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  // Remove user
  const removeUser = async (userId: string) => {
    if (
      !confirm("Are you sure to remove this user? This action cannot be undo.")
    ) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data } = await axiosInstance.delete(`/users/${userId}`, {
        headers: {
          "x-api-key": import.meta.env.VITE_API_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (data.success) {
        toast.success(data.message);

        if (selectedUser?.id === userId) {
          setIsViewDialogOpen(false);
          setSelectedUser(null);
        }

        await fetchUsers();
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      console.error("Error removing user:", error);
      setError(error.response?.data?.message || "Failed to remove user");
    } finally {
      setIsLoading(false);
    }
  };

  const resetUserPassword = async (userId: string) => {
    if (!confirm("Are you sure to reset password for this user?")) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data } = await axiosInstance.put(
        `/users/${userId}/reset-password`,
        {},
        {
          headers: {
            "x-api-key": import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      console.error("Error resetting password:", error);
      setError(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ============ HANDLERS ============
  const handleSearch = () => {
    fetchUsers();
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

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
              className="flex h-10 w-full rounded-md border border-gray-300 bg-[hsl(var(--background))] pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-white hover:bg-slate-900/90 h-10 px-4 py-2 cursor-pointer"
          >
            {isLoading ? "Searching..." : "Search"}
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
          <div className="flex items-center justify-center py-6">
            <LoadingSpinner />
          </div>
        ) : users.length === 0 ? (
          <div className="py-6 flex flex-col items-center justify-center">
            <User className="size-8" strokeWidth={1.5} />
            <p>No users found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[hsl(var(--border))]">
                <th className="h-12 min-w-45 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
                  Username
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
                  Email
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
                  Address
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
                  Rating
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
                  Join At
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
                  Role
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-[hsl(var(--border))] transition-colors hover:bg-[hsl(var(--muted)/0.5)]"
                >
                  <td className="p-4 align-middle font-medium">
                    {user.fullName || user.username}
                  </td>
                  <td className="p-4 align-middle">{user.email}</td>
                  <td className="p-4 align-middle">{user.address || "N/A"}</td>
                  <td className="p-4 align-middle">
                    {calculateUserRating(user)}%
                  </td>
                  <td className="p-4 align-middle">
                    {new Date(user.createdAt).toLocaleString()}
                  </td>
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
                  <td className="p-4 align-middle">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewUser(user)}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:bg-gray-200 hover:text-[hsl(var(--accent-foreground))] h-9 px-3 cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => removeUser(user.id)}
                        className="inline-flex items-center justify-center bg-red-500 text-white hover:bg-red-600 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 cursor-pointer"
                        disabled={isLoading}
                        title="Remove User"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {isLoading ? "Removing..." : "Remove"}
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
                  <X className="size-4" />
                </button>
              </div>

              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Username
                    </p>
                    <p className="font-medium">
                      {selectedUser.fullName || selectedUser.username}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Email
                    </p>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Address
                    </p>
                    <p className="font-medium capitalize">
                      {selectedUser.address || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Rating
                    </p>
                    <p className="font-medium">
                      {calculateUserRating(selectedUser)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Join At
                    </p>
                    <p className="font-medium">{new Date(selectedUser.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Role
                    </p>
                    <p className="font-medium">{selectedUser.role}</p>
                  </div>
                </div>

                {/* Action Buttons in Modal */}
                <div className="pt-4 border-t border-[hsl(var(--border))]">
                  <h4 className="font-semibold mb-3">Actions</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => removeUser(selectedUser.id)}
                      disabled={isLoading}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-500 text-white hover:bg-red-600 h-10 px-4 py-2 cursor-pointer"
                    >
                      Remove User
                    </button>
                    <button
                      onClick={() => resetUserPassword(selectedUser.id)}
                      disabled={isLoading}
                      className="inline-flex items-center justify-center bg-amber-500 text-white hover:bg-amber-600 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 cursor-pointer"
                    >
                      Reset Password
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

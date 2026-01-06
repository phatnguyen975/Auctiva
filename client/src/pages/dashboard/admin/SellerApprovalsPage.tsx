import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { Search, Loader2, UserCheck, UserX } from "lucide-react";

import { axiosInstance } from "../../../lib/axios";
import { getHeaders } from "../../../utils/getHeaders";
import { formatVietnamDateTime } from "../../../utils/date";

interface SellerRequest {
  id: string;
  username: string;
  email: string;
  currentRating: number;
  totalBids: number;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
  // Additional fields for detail view
  fullName?: string;
  joinDate?: string;
  totalWonAuctions?: number;
  totalSpent?: number;
  reason?: string;
}

const SellerApprovalsPage = () => {
  const [requests, setRequests] = useState<SellerRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<SellerRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "approve" | "reject";
    requestId: string;
    username: string;
  } | null>(null);

  // Fetch seller upgrade requests
  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const headers = getHeaders();
      const response = await axiosInstance.get("/seller-upgrade-requests", {
        headers,
      });

      if (response.data.success) {
        const mappedData = response.data.data.map((item: any) => ({
          id: item.id,
          username: item.user.username,
          fullName: item.user.fullName,
          email: item.user.email,
          requestDate: formatVietnamDateTime(new Date(item.requestedAt)),
          status: item.status,
          totalBids: item.user._count.bids || 0,
          // Các trường bổ sung nếu Backend trả về
          currentRating:
            Number(
              (
                ((item.user.ratingPositive || 0) /
                  (item.user.ratingCount || 1)) *
                100
              ).toFixed(2)
            ) || 0,
        }));
        setRequests(mappedData);
        setFilteredRequests(mappedData);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch requests");
    } finally {
      setIsLoading(false);
    }
  };

  console.log("Requests:", requests);

  // Handle approve action
  const handleApproveRequest = (request: SellerRequest) => {
    setConfirmAction({
      type: "approve",
      requestId: request.id,
      username: request.username,
    });
    setIsConfirmDialogOpen(true);
  };

  // Handle reject action
  const handleRejectRequest = (request: SellerRequest) => {
    setConfirmAction({
      type: "reject",
      requestId: request.id,
      username: request.username,
    });
    setIsConfirmDialogOpen(true);
  };

  // Handle confirm action
  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    setIsLoading(true);

    try {
      // API: PUT /api/seller-upgrades/:id
      const headers = getHeaders();
      const response = await axiosInstance.put(
        `/seller-upgrade-requests/${confirmAction.requestId}`,
        {
          status: confirmAction.type === "approve" ? "approved" : "rejected",
        },
        { headers }
      );

      if (response.data.success) {
        toast.success(
          `Đã ${
            confirmAction.type === "approve" ? "duyệt" : "từ chối"
          } thành công!`
        );
        setIsConfirmDialogOpen(false);
        fetchRequests(); // Tải lại danh sách
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Thao tác thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  // Search filter
  useEffect(() => {
    const pendingRequests = requests.filter((r) => r.status === "pending");

    if (searchQuery.trim() === "") {
      setFilteredRequests(pendingRequests);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredRequests(
        pendingRequests.filter(
          (request) =>
            request.username.toLowerCase().includes(query) ||
            request.email.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, requests]);

  // Initial fetch
  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Seller Upgrade Requests</h2>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
          Review and manage seller upgrade requests from users
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[hsl(var(--border))] rounded-md bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
          />
        </div>
        <div className="text-sm text-[hsl(var(--muted-foreground))]">
          {filteredRequests.length} pending request
          {filteredRequests.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Error Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && !requests.length ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--primary))]" />
        </div>
      ) : (
        <>
          {/* Requests Table */}
          <div className="bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--border))] overflow-hidden">
            <table className="w-full">
              <thead className="bg-[hsl(var(--muted))]">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase">
                    User
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase">
                    Rating
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase">
                    Bids
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase">
                    Request Date
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[hsl(var(--card))] divide-y divide-[hsl(var(--border))]">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-8 text-center text-sm text-[hsl(var(--muted-foreground))]"
                    >
                      No pending seller requests found
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="hover:bg-[hsl(var(--muted))] transition-colors"
                    >
                      <td className="px-3 py-3">
                        <div className="text-sm font-medium text-[hsl(var(--foreground))]">
                          {request.username}
                        </div>
                        <div className="text-xs text-[hsl(var(--muted-foreground))]">
                          {request.email}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            request.currentRating >= 80
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {request.currentRating}%
                        </span>
                      </td>
                      <td className="px-3 py-3 text-sm text-[hsl(var(--foreground))]">
                        {request.totalBids}
                      </td>
                      <td className="px-3 py-3 text-xs text-[hsl(var(--muted-foreground))]">
                        {request.requestDate}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleApproveRequest(request)}
                            disabled={isLoading}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 h-8 px-2 cursor-pointer"
                            title="Approve"
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request)}
                            disabled={isLoading}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 h-8 px-2 cursor-pointer"
                            title="Reject"
                          >
                            <UserX className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Confirmation Dialog */}
      {isConfirmDialogOpen && confirmAction && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={() => setIsConfirmDialogOpen(false)}
        >
          <div
            className="bg-[hsl(var(--card))] rounded-lg shadow-lg w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Confirm Action</h2>
            <p className="text-[hsl(var(--muted-foreground))] mb-6">
              {confirmAction.type === "approve" ? (
                <>
                  Are you sure you want to approve the seller upgrade request
                  from <strong>{confirmAction.username}</strong>? They will be
                  granted seller privileges.
                </>
              ) : (
                <>
                  Are you sure you want to reject the seller upgrade request
                  from <strong>{confirmAction.username}</strong>? They will need
                  to submit a new request.
                </>
              )}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsConfirmDialogOpen(false)}
                disabled={isLoading}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] h-10 px-4 py-2 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={isLoading}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 cursor-pointer ${
                  confirmAction.type === "approve"
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {confirmAction.type === "approve" ? (
                      <>
                        <UserCheck className="h-4 w-4 mr-2" />
                        Approve
                      </>
                    ) : (
                      <>
                        <UserX className="h-4 w-4 mr-2" />
                        Reject
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerApprovalsPage;

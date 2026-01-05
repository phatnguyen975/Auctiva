import { useState, useEffect } from "react";
import { Search, Loader2, Eye, UserCheck, UserX, X } from "lucide-react";
import { axiosInstance } from "../../../lib/axios";

interface SellerRequest {
  id: string;
  username: string;
  email: string;
  currentRating: number;
  accountAge: number;
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
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SellerRequest | null>(
    null
  );
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "approve" | "reject";
    requestId: string;
    username: string;
  } | null>(null);

  // Fetch seller upgrade requests
  const fetchRequests = async () => {
    setIsLoading(true);
    setError(null);

    // Mock data for development (remove this and uncomment API call when backend is ready)
    const mockRequests: SellerRequest[] = [
      {
        id: "1",
        username: "john_doe",
        email: "john@example.com",
        currentRating: 85,
        accountAge: 45,
        totalBids: 127,
        requestDate: "2025-12-15",
        status: "pending",
        fullName: "John Doe",
        joinDate: "2025-11-15",
        totalWonAuctions: 32,
        totalSpent: 4500,
        reason: "I want to sell vintage watches from my collection.",
      },
      {
        id: "2",
        username: "jane_smith",
        email: "jane@example.com",
        currentRating: 92,
        accountAge: 60,
        totalBids: 203,
        requestDate: "2025-12-20",
        status: "pending",
        fullName: "Jane Smith",
        joinDate: "2025-11-01",
        totalWonAuctions: 58,
        totalSpent: 8900,
        reason: "Looking to expand my antique business to online auctions.",
      },
      {
        id: "3",
        username: "mike_wilson",
        email: "mike@example.com",
        currentRating: 75,
        accountAge: 25,
        totalBids: 89,
        requestDate: "2025-12-25",
        status: "pending",
        fullName: "Mike Wilson",
        joinDate: "2025-12-05",
        totalWonAuctions: 18,
        totalSpent: 2100,
        reason: "Want to sell electronics and gadgets.",
      },
    ];

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    setRequests(mockRequests);
    const pending = mockRequests.filter((r) => r.status === "pending");
    setFilteredRequests(pending);
    setIsLoading(false);

    /* TODO: Uncomment when API is ready
    try {
      const response = await axiosInstance.get("/api/admin/seller-requests");
      const data = Array.isArray(response.data) ? response.data : [];
      setRequests(data);
      const pending = data.filter((r: SellerRequest) => r.status === "pending");
      setFilteredRequests(pending);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch seller requests");
    } finally {
      setIsLoading(false);
    }
    */
  };

  // Approve seller request
  const approveRequest = async (requestId: string) => {
    setIsLoading(true);
    setError(null);

    // Mock API call (remove this when backend is ready)
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Update local state
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "approved" as const } : req
      )
    );
    setFilteredRequests((prev) => prev.filter((req) => req.id !== requestId));

    setIsConfirmDialogOpen(false);
    setIsViewDialogOpen(false);
    setIsLoading(false);

    /* TODO: Uncomment when API is ready
    try {
      await axiosInstance.post(`/api/admin/seller-requests/${requestId}/approve`);
      
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: "approved" as const } : req
        )
      );
      setFilteredRequests((prev) => prev.filter((req) => req.id !== requestId));

      setIsConfirmDialogOpen(false);
      setIsViewDialogOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to approve request");
    } finally {
      setIsLoading(false);
    }
    */
  };

  // Reject seller request
  const rejectRequest = async (requestId: string) => {
    setIsLoading(true);
    setError(null);

    // Mock API call (remove this when backend is ready)
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Update local state
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "rejected" as const } : req
      )
    );
    setFilteredRequests((prev) => prev.filter((req) => req.id !== requestId));

    setIsConfirmDialogOpen(false);
    setIsViewDialogOpen(false);
    setIsLoading(false);

    /* TODO: Uncomment when API is ready
    try {
      await axiosInstance.post(`/api/admin/seller-requests/${requestId}/reject`);
      
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: "rejected" as const } : req
        )
      );
      setFilteredRequests((prev) => prev.filter((req) => req.id !== requestId));

      setIsConfirmDialogOpen(false);
      setIsViewDialogOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reject request");
    } finally {
      setIsLoading(false);
    }
    */
  };

  // Get request details
  const getRequestDetails = async (requestId: string) => {
    // Mock: Use existing data from list (remove this when backend is ready)
    const request = requests.find((r) => r.id === requestId);
    if (request) {
      setSelectedRequest(request);
      setIsViewDialogOpen(true);
    }

    /* TODO: Uncomment when API is ready
    try {
      const response = await axiosInstance.get(`/api/admin/seller-requests/${requestId}`);
      setSelectedRequest(response.data);
      setIsViewDialogOpen(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch request details");
      // Use existing data from list as fallback
      const request = requests.find((r) => r.id === requestId);
      if (request) {
        setSelectedRequest(request);
        setIsViewDialogOpen(true);
      }
    }
    */
  };

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
  const handleConfirmAction = () => {
    if (!confirmAction) return;

    if (confirmAction.type === "approve") {
      approveRequest(confirmAction.requestId);
    } else {
      rejectRequest(confirmAction.requestId);
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
                    Age
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
                      colSpan={6}
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
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            request.accountAge >= 30
                              ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                              : "bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]"
                          }`}
                        >
                          {request.accountAge}d
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
                            onClick={() => getRequestDetails(request.id)}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-[hsl(var(--accent))] h-8 w-8 cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
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

      {/* View Details Dialog */}
      {isViewDialogOpen && selectedRequest && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setIsViewDialogOpen(false)}
        >
          <div
            className="bg-[hsl(var(--card))] rounded-lg shadow-lg w-full max-w-3xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              {/* Dialog Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Request Details</h2>
                <button
                  onClick={() => setIsViewDialogOpen(false)}
                  className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Combined User Information & Statistics */}
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="bg-[hsl(var(--muted))] p-3 rounded-md">
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">
                      Username
                    </p>
                    <p className="font-medium">{selectedRequest.username}</p>
                  </div>
                  <div className="bg-[hsl(var(--muted))] p-3 rounded-md">
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">
                      Email
                    </p>
                    <p className="font-medium text-xs">
                      {selectedRequest.email}
                    </p>
                  </div>
                  <div className="bg-[hsl(var(--muted))] p-3 rounded-md">
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">
                      Request Date
                    </p>
                    <p className="font-medium">{selectedRequest.requestDate}</p>
                  </div>
                  <div className="bg-[hsl(var(--muted))] p-3 rounded-md">
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">
                      Rating
                    </p>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        selectedRequest.currentRating >= 80
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedRequest.currentRating}%
                    </span>
                  </div>
                  <div className="bg-[hsl(var(--muted))] p-3 rounded-md">
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">
                      Account Age
                    </p>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        selectedRequest.accountAge >= 30
                          ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                          : "bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]"
                      }`}
                    >
                      {selectedRequest.accountAge} days
                    </span>
                  </div>
                  <div className="bg-[hsl(var(--muted))] p-3 rounded-md">
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">
                      Total Bids
                    </p>
                    <p className="font-medium">{selectedRequest.totalBids}</p>
                  </div>
                  <div className="bg-[hsl(var(--muted))] p-3 rounded-md">
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">
                      Won Auctions
                    </p>
                    <p className="font-medium">
                      {selectedRequest.totalWonAuctions || 0}
                    </p>
                  </div>
                  <div className="bg-[hsl(var(--muted))] p-3 rounded-md">
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">
                      Total Spent
                    </p>
                    <p className="font-medium">
                      ${selectedRequest.totalSpent?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className="bg-[hsl(var(--muted))] p-3 rounded-md">
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">
                      Full Name
                    </p>
                    <p className="font-medium">
                      {selectedRequest.fullName || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Reason */}
                {selectedRequest.reason && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">
                      Reason for Request
                    </h3>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] p-3 rounded-md">
                      {selectedRequest.reason}
                    </p>
                  </div>
                )}

                {/* Eligibility Check */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">
                    Eligibility Status
                  </h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 flex-1 bg-[hsl(var(--muted))] p-2 rounded">
                      <div
                        className={`h-4 w-4 rounded-full flex items-center justify-center ${
                          selectedRequest.currentRating >= 80
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        <span className="text-white text-xs">
                          {selectedRequest.currentRating >= 80 ? "✓" : "✗"}
                        </span>
                      </div>
                      <span className="text-xs">Rating ≥ 80%</span>
                    </div>
                    <div className="flex items-center gap-2 flex-1 bg-[hsl(var(--muted))] p-2 rounded">
                      <div
                        className={`h-4 w-4 rounded-full flex items-center justify-center ${
                          selectedRequest.accountAge >= 30
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        <span className="text-white text-xs">
                          {selectedRequest.accountAge >= 30 ? "✓" : "✗"}
                        </span>
                      </div>
                      <span className="text-xs">Age ≥ 30 days</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-[hsl(var(--border))] pt-3 flex gap-2 justify-between">
                  <button
                    onClick={() => setIsViewDialogOpen(false)}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] h-9 px-4 cursor-pointer"
                  >
                    Close
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        handleApproveRequest(selectedRequest);
                        setIsViewDialogOpen(false);
                      }}
                      disabled={isLoading}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-500 text-white hover:bg-green-600 h-9 px-4 cursor-pointer"
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        handleRejectRequest(selectedRequest);
                        setIsViewDialogOpen(false);
                      }}
                      disabled={isLoading}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-500 text-white hover:bg-red-600 h-9 px-4 cursor-pointer"
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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

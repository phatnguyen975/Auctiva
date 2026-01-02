import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import { getHeaders } from "../../lib/getHeaders";
import type { RootState } from "../../store/store";
import TransactionFlow from "../../components/transaction/TransactionFlow";
import AuctionEndedOverlay from "../../components/transaction/AuctionEndedOverlay";

type UserType = "winner" | "seller" | "non-participant";

interface TransactionData {
  id: number;
  status: string;
  winnerId: string;
  sellerId: string;
  finalPrice: number;
  shippingAddress?: string;
  paymentProof?: string;
  shippingReceipt?: string;
  product: {
    id: number;
    name: string;
    currentPrice: number;
    description?: string;
  };
  winner: {
    id: string;
    fullName: string;
    avatarUrl?: string;
  };
  seller: {
    id: string;
    fullName: string;
    avatarUrl?: string;
  };
}

const TransactionPage = () => {
  const { id } = useParams<{ id: string }>();
  const authUser = useSelector((state: RootState) => state.auth.authUser);
  const [userRole, setUserRole] = useState<UserType>("non-participant");
  const [transactionData, setTransactionData] =
    useState<TransactionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch transaction data
  useEffect(() => {
    if (id) {
      fetchTransactionData();
    }
  }, [id]);

  const fetchTransactionData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const headers = getHeaders();
      const response = await axiosInstance.get(`/transactions/${id}`, {
        headers,
      });

      if (response.data) {
        const data: TransactionData = response.data;
        setTransactionData(data);

        if (authUser?.user) {
          if (authUser.user.id === data.winner.id) {
            setUserRole("winner");
          } else if (authUser.user.id === data.seller.id) {
            setUserRole("seller");
          } else {
            setUserRole("non-participant");
          }
        } else {
          setUserRole("non-participant");
        }
      } else if (response.data && response.data.id) {
        // Direct data without wrapper
        const data: TransactionData = response.data;
        setTransactionData(data);

        // Determine user role
        if (authUser?.user) {
          if (authUser.user.id === data.winner.id) {
            setUserRole("winner");
          } else if (authUser.user.id === data.seller.id) {
            setUserRole("seller");
          } else {
            setUserRole("non-participant");
          }
        } else {
          setUserRole("non-participant");
        }
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err: any) {
      console.error("Error fetching transaction:", err);
      const errorMessage =
        err.message ||
        err.response?.data?.message ||
        "Failed to load transaction";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // If no id, show error
  if (!id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">
            Invalid Transaction
          </h2>
          <p className="text-muted-foreground mt-2">Transaction ID not found</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !transactionData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">Error</h2>
          <p className="text-muted-foreground mt-2">
            {error || "Transaction not found"}
          </p>
        </div>
      </div>
    );
  }

  // Extract data from API response
  const productTitle = transactionData.product.name;
  const winningBid = `$${transactionData.product.currentPrice.toLocaleString()}`;
  const winnerName = transactionData.winner.fullName;
  const sellerName = transactionData.seller.fullName;

  return (
    <div className="min-h-screen bg-background py-8">
      {/* Content based on user type */}
      {userRole === "non-participant" ? (
        <div className="container mx-auto px-4">
          <AuctionEndedOverlay
            winnerName={winnerName}
            winningBid={winningBid}
            endDate="2 hours ago"
          />

          {/* Standard Product Detail (Disabled/Read-only) */}
          <div className="bg-transparent flex flex-col gap-6 rounded-xl border border-gray-400/50 transition-colors duration-300 p-6 opacity-60 pointer-events-none">
            <div className="space-y-4">
              <div>
                <span
                  className="inline-flex items-center bg-transparent hover:bg-amber-600 justify-center rounded-md border px-2 py-0.5 text-xs font-medium  w-fit whitespace-nowrap 
                  text-primary border-primary shrink-0 gap-1"
                >
                  Reference Only
                </span>
                <h2 className="text-xl font-semibold mt-2">{productTitle}</h2>
              </div>
              {transactionData.product.description && (
                <p className="text-muted-foreground">
                  {transactionData.product.description}
                </p>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">
                    {transactionData.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Final Price</p>
                  <p className="font-medium">{winningBid}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <TransactionFlow
          transactionId={id}
          userRole={userRole}
          partnerName={userRole === "winner" ? sellerName : winnerName}
          productTitle={productTitle}
          winningBid={winningBid}
        />
      )}
    </div>
  );
};

export default TransactionPage;

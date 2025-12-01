import { useState } from "react";
import TransactionFlow from "../../components/transaction/TransactionFlow";
import AuctionEndedOverlay from "../../components/transaction/AuctionEndedOverlay";

type UserType = "winner" | "seller" | "non-participant";

const TransactionPage = () => {
  const [viewAs, setViewAs] = useState<UserType>("winner");

  // Mock data
  const productData = {
    title: "Vintage Rolex Submariner Watch - 1970s",
    winningBid: "$8,500",
    winnerName: "JohnDoe",
    sellerName: "WatchCollector",
    endDate: "2 hours ago",
  };

  return (
    <div className="min-h-screen bg-background py-8">
      {/* Content based on user type */}
      {viewAs === "non-participant" ? (
        <div className="container mx-auto px-4">
          <AuctionEndedOverlay
            winnerName={productData.winnerName}
            winningBid={productData.winningBid}
            endDate={productData.endDate}
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
                <h2 className="text-xl font-semibold mt-2">
                  {productData.title}
                </h2>
              </div>
              <p className="text-muted-foreground">
                This is a vintage Rolex Submariner from the 1970s in excellent
                condition. Original box and papers included.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">Watches</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Condition</p>
                  <p className="font-medium">Excellent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <TransactionFlow
          userRole={viewAs}
          partnerName={
            viewAs === "winner"
              ? productData.sellerName
              : productData.winnerName
          }
          productTitle={productData.title}
          winningBid={productData.winningBid}
        />
      )}
    </div>
  );
};

export default TransactionPage;

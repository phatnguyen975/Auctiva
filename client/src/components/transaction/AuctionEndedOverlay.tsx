import { Trophy, Clock } from "lucide-react";

interface AuctionEndedOverlayProps {
  winnerName: string;
  winningBid: string;
  endDate: string;
}

const AuctionEndedOverlay = ({
  winnerName,
  winningBid,
  endDate,
}: AuctionEndedOverlayProps) => {
  // Mask winner name (show only first letter + asterisks)
  const maskedName = winnerName.charAt(0) + "*".repeat(winnerName.length - 1);

  return (
    <div className="relative">
      {/* Overlay Banner */}
      <div className="bg-yellow-200 flex flex-col gap-6 rounded-xl border transition-colors duration-300 bg-linear-to-r from-amber-50 to-amber-100 border-amber-200 p-8 text-center mb-6">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-amber-500 rounded-full p-3">
            <Trophy className="h-8 w-8 text-white" />
          </div>

          <div>
            <span
              className="inline-flex items-center bg-amber-500 hover:bg-amber-600 justify-center rounded-md border px-2 py-1 text-xs font-medium  w-fit whitespace-nowrap 
                    text-white border-none shrink-0 gap-1"
            >
              Auction Ended
            </span>
            <h2 className="text-2xl font-bold text-amber-900 mb-2">
              This Auction Has Concluded
            </h2>
            <p className="text-amber-700">
              The winning bid has been placed and the transaction is in progress
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
            <div className="flex items-center gap-3">
              <div className="relative flex size-10 shrink-0 overflow-hidden rounded-full h-12 w-12 border-2 border-amber-400">
                <div className="bg-yellow-300 flex size-full items-center justify-center rounded-full w-full h-full object-cover">
                  {winnerName.charAt(0)}
                </div>
              </div>
              <div className="text-left">
                <p className="text-sm text-amber-600">Winner</p>
                <p className="font-semibold text-amber-900">{maskedName}</p>
              </div>
            </div>

            <div className="h-px w-12 bg-amber-300 hidden sm:block" />

            <div className="text-left">
              <p className="text-sm text-amber-600">Winning Bid</p>
              <p className="text-xl font-bold text-amber-900">{winningBid}</p>
            </div>

            <div className="h-px w-12 bg-amber-300 hidden sm:block" />

            <div className="text-left">
              <p className="text-sm text-amber-600 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Ended
              </p>
              <p className="font-medium text-amber-900">{endDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dimmed Product Details Message */}
      <div className="bg-gray-200/50 rounded-lg p-6 text-center">
        <p className="text-sm text-gray-400">
          Product details are shown below for reference only. Bidding is no
          longer available.
        </p>
      </div>
    </div>
  );
};

export default AuctionEndedOverlay;

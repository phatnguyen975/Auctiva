import { formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";
import { User, Ban } from "lucide-react";

import type { RootState } from "../../../store/store";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/Table";

// Định nghĩa kiểu dữ liệu cho Bid (nếu bạn chưa có file types chung)
interface Bid {
  createdAt: Date;
  bidder: {
    id: string;
    fullName: string;
    username: string;
    ratingPositive: number;
    ratingCount: number;
  };
  rating: number;
  maxBid: number;
}

interface BidHistoryTableProps {
  bids: Bid[];
  productSellerId?: string;
  onBanUser: (bid: Bid, index: number) => void; // Callback khi bấm nút Ban
}

export function BidHistoryTable({
  bids,
  productSellerId,
  onBanUser,
}: BidHistoryTableProps) {
  const authUser = useSelector((state: RootState) => state.auth.authUser);
  const currentUserId = authUser?.user?.id;

  const isPrivileged = currentUserId === productSellerId; // Seller role

  return (
    <div className="bg-card rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Bidder</TableHead>
            <TableHead className="text-right">Bid Amount</TableHead>
            {isPrivileged && (
              <TableHead className="text-right">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {bids.map((bid, index) => (
            <TableRow key={index}>
              <TableCell>
                {formatDistanceToNow(new Date(bid.createdAt), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {/* {bid.bidder} */}
                      {formatBidderName(
                        bid.bidder?.fullName || bid.bidder?.username,
                        isPrivileged
                      )}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {(
                        ((bid.bidder?.ratingPositive || 0) /
                          (bid.bidder?.ratingCount || 1)) *
                        100
                      ).toFixed(2)}
                      % rating
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right font-semibold">
                {isPrivileged || currentUserId === bid.bidder.id
                  ? `$${Number(bid.maxBid).toLocaleString()}`
                  : "***"}
              </TableCell>
              {isPrivileged && (
                <TableCell className="text-right">
                  <button
                    onClick={() => onBanUser(bid, index)}
                    className="inline-flex items-center bg-transparent text-red-500 px-3 py-2 rounded-lg cursor-pointer text-sm font-semibold hover:bg-red-50 transition-colors"
                  >
                    <Ban className="h-4 w-4 mr-1" />
                    Ban User
                  </button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const formatBidderName = (fullName: string, isPrivileged: boolean) => {
  if (isPrivileged) return fullName;
  // Hiện 4 ký tự cuối, còn lại là dấu *
  return "****" + fullName.slice(-4);
};

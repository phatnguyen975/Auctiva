import React from "react";
import { User, Ban } from "lucide-react";
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
  time: string;
  bidder: string;
  rating: number;
  amount: number;
}

interface BidHistoryTableProps {
  bids: Bid[];
  role: string; // "seller" | "bidder"
  onBanUser: (bid: Bid, index: number) => void; // Callback khi bấm nút Ban
}

export function BidHistoryTable({
  bids,
  role,
  onBanUser,
}: BidHistoryTableProps) {
  return (
    <div className="bg-card rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Bidder</TableHead>
            <TableHead className="text-right">Bid Amount</TableHead>
            {role === "seller" && (
              <TableHead className="text-right">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {bids.map((bid, index) => (
            <TableRow key={index}>
              <TableCell>{bid.time}</TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{bid.bidder}</div>
                    <div className="text-muted-foreground text-xs">
                      {bid.rating}% rating
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right font-semibold">
                ${bid.amount}
              </TableCell>
              {role === "seller" && (
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

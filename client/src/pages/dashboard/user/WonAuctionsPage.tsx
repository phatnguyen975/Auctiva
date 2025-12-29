import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Award,
  Star,
  ThumbsDown,
  ThumbsUp,
  Trophy,
  XCircle,
} from "lucide-react";

import { dumpyWonAuctions } from "../../../assets/assets";

interface Item {
  id: number | string;
  image: string;
  title: string;
  winningPrice: number;
  seller: string;
  sellerRating: number;
  rated: boolean;
  wonDate: string;
}

const WonAuctionsPage = () => {
  const [wonAuctions, setWonAuctions] = useState<Item[]>([]);
  const [itemToRate, setItemToRate] = useState<Item | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadWinAuctions = async () => {
      // Call API
      setWonAuctions(dumpyWonAuctions);
    };

    loadWinAuctions();
  });

  const handleSubmitRating = () => {
    alert("You have submited rating");
  };

  return (
    <>
      <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] flex flex-col gap-6 rounded-xl border border-[hsl(var(--border))] transition-colors duration-300 p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Won Auctions</h2>
              <p className="text-muted-foreground">Your auction victories</p>
            </div>
            <span
              className="inline-flex items-center bg-gray-200 justify-center rounded-md px-2 py-1 text-xm font-medium w-fit whitespace-nowrap 
                  text-primary border-primary shrink-0 gap-1"
            >
              {wonAuctions.length} items
            </span>
          </div>

          {wonAuctions.length === 0 ? (
            <div className="text-center py-16">
              <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-semibold mb-2">
                No won auctions yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Keep bidding to win your first item
              </p>
              <button
                className="rounded-md px-4 py-2 text-sm text-white bg-slate-900 font-medium transition-colors shadow-sm hover:bg-slate-400 hover:cursor-pointer"
                onClick={() => navigate("/products")}
              >
                Browse Auctions
              </button>
            </div>
          ) : (
            <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] flex flex-col gap-6 rounded-xl border border-[hsl(var(--border))] transition-colors duration-300">
              <div className="relative w-full overflow-x-auto">
                {/* Cấu trúc table thuần không phụ thuộc component ngoài */}
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50">
                      <th className="h-10 px-2 text-left align-middle font-medium text-foreground whitespace-nowrap">
                        Product
                      </th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-foreground whitespace-nowrap">
                        Winning Price
                      </th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-foreground whitespace-nowrap">
                        Seller
                      </th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-foreground whitespace-nowrap">
                        Won Date
                      </th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-foreground whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="[&_tr:last-child]:border-0">
                    {wonAuctions.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        {/* Cột Product */}
                        <td className="p-2 align-middle whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <span className="font-medium">{item.title}</span>
                          </div>
                        </td>

                        {/* Cột Winning Price */}
                        <td className="p-2 align-middle whitespace-nowrap font-bold text-primary">
                          ${item.winningPrice.toLocaleString()}
                        </td>

                        {/* Cột Seller & Rating */}
                        <td className="p-2 align-middle whitespace-nowrap">
                          <div>
                            <div className="font-medium">{item.seller}</div>
                            <div className="flex items-center gap-1 text-sm text-amber-600">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span>{item.sellerRating}%</span>
                            </div>
                          </div>
                        </td>

                        {/* Cột Won Date */}
                        <td className="p-2 align-middle whitespace-nowrap text-slate-500">
                          {item.wonDate}
                        </td>

                        {/* Cột Actions */}
                        <td className="p-2 align-middle whitespace-nowrap">
                          {!item.rated ? (
                            <button
                              onClick={() => setItemToRate(item)} // Mở popup bằng cách set state
                              className="flex justify-center items-center rounded-md px-3 py-1.5 text-sm font-medium border border-slate-300 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:cursor-pointer"
                            >
                              <Award className="h-4 w-4 mr-1 text-primary" />
                              Rate Seller
                            </button>
                          ) : (
                            <span className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                              Rated
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {itemToRate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay nền đen mờ + blur */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setItemToRate(null)} // Click ra ngoài để đóng
          />

          {/* Nội dung Hộp thoại (Card) */}
          <div className="relative bg-white border border-slate-200 w-full max-w-md rounded-xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            {/* Header Popup */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                Rate {itemToRate.seller}
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                How was your experience with this seller?
              </p>
            </div>

            {/* Body: Thumbs Buttons */}
            <div className="space-y-6">
              <div className="flex gap-4 justify-center">
                <button className="group flex-1 h-24 flex flex-col items-center justify-center rounded-xl border-2 border-slate-100 bg-slate-50 transition-all hover:border-green-500 hover:bg-green-50">
                  <ThumbsUp className="h-8 w-8 mb-1 text-slate-400 group-hover:text-green-600 transition-colors" />
                  <span className="text-sm font-semibold text-slate-600 group-hover:text-green-700">
                    Thumbs Up
                  </span>
                  <span className="text-xs text-slate-400">(+1)</span>
                </button>

                <button className="group flex-1 h-24 flex flex-col items-center justify-center rounded-xl border-2 border-slate-100 bg-slate-50 transition-all hover:border-red-500 hover:bg-red-50">
                  <ThumbsDown className="h-8 w-8 mb-1 text-slate-400 group-hover:text-red-600 transition-colors" />
                  <span className="text-sm font-semibold text-slate-600 group-hover:text-red-700">
                    Thumbs Down
                  </span>
                  <span className="text-xs text-slate-400">(-1)</span>
                </button>
              </div>

              {/* Body: Comment Area */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  Comment (Optional)
                </label>
                <textarea
                  placeholder="Share more details about the product or delivery..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                  rows={4}
                />
              </div>

              {/* Footer: Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => setItemToRate(null)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-4 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all active:scale-[0.98]"
                  onClick={() => handleSubmitRating()}
                >
                  Submit Rating
                </button>
              </div>
            </div>

            {/* Nút X đóng nhanh ở góc */}
            <button
              onClick={() => setItemToRate(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WonAuctionsPage;

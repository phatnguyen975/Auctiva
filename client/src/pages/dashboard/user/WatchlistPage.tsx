import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Eye, Heart, XCircle } from "lucide-react";

import { dumpyWatchist } from "../../../assets/assets";
import CountdownTimer from "../../../components/product/details/CountdownTimer";

interface Item {
  id: number | string;
  image: string;
  title: string;
  currentBid: number;
  timeLeft: Date;
  totalBids: number;
}

const WatchlistPage = () => {
  const [watchlist, setWatchList] = useState<Item[]>([]);
  const [itemToDelete, setItemToDelete] = useState<number | string | null>(
    null
  );

  const navigate = useNavigate();

  useEffect(() => {
    const loadWatchList = async () => {
      // Call API
      setWatchList(dumpyWatchist);
    };

    loadWatchList();
  }, []);

  const handleRequestDelete = (id: number | string) => {
    setItemToDelete(id);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete !== null) {
      setWatchList((prev) => prev.filter((item) => item.id !== itemToDelete));
      setItemToDelete(null); // Đóng popup
    }
  };

  const handleCancelDelete = () => {
    setItemToDelete(null);
  };

  return (
    <>
      <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] flex flex-col gap-6 rounded-xl border border-[hsl(var(--border))] transition-colors duration-300 p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Watchlist</h2>
              <p className="text-muted-foreground">
                Items you're interested in
              </p>
            </div>
            <span
              className="inline-flex items-center bg-gray-200 justify-center rounded-md px-2 py-1 text-xm font-medium w-fit whitespace-nowrap 
                  text-primary border-primary shrink-0 gap-1"
            >
              {watchlist.length} items
            </span>
          </div>

          {watchlist.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-semibold mb-2">
                No items in watchlist
              </h3>
              <p className="text-muted-foreground mb-6">
                Start adding items you're interested in
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
                {/* Tương ứng với component <Table> */}
                <table className="w-full caption-bottom text-sm">
                  {/* Tương ứng với component <TableHeader> */}
                  <thead className="[&_tr]:border-b">
                    {/* Tương ứng với component <TableRow> trong header */}
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      {/* Tương ứng với component <TableHead> */}
                      <th className="h-10 px-2 text-left align-middle font-medium text-foreground whitespace-nowrap">
                        Product
                      </th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-foreground whitespace-nowrap">
                        Current Bid
                      </th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-foreground whitespace-nowrap">
                        Bids
                      </th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-foreground whitespace-nowrap">
                        Time Left
                      </th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-foreground whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  {/* Tương ứng với component <TableBody> */}
                  <tbody className="[&_tr:last-child]:border-0">
                    {watchlist.map((item) => (
                      /* Tương ứng với component <TableRow> trong body */
                      <tr
                        key={item.id}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        {/* Tương ứng với component <TableCell> */}
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

                        <td className="p-2 align-middle whitespace-nowrap font-bold text-primary">
                          ${item.currentBid.toLocaleString()}
                        </td>

                        <td className="p-2 align-middle whitespace-nowrap">
                          {item.totalBids}
                        </td>

                        <td className="p-2 align-middle whitespace-nowrap">
                          <CountdownTimer endTime={item.timeLeft} compact />
                        </td>

                        <td className="p-2 align-middle whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              className="flex justify-center items-center rounded-md px-4 py-2 text-sm text-white bg-slate-900 font-medium transition-colors shadow-sm hover:bg-slate-500 hover:cursor-pointer"
                              onClick={() => navigate(`/products/${item.id}`)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </button>
                            <button
                              className="flex justify-center items-center rounded-md px-4 py-2 text-sm text-black bg-slate-300 font-medium transition-colors shadow-sm hover:bg-slate-500 hover:cursor-pointer"
                              onClick={() => handleRequestDelete(item.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Remove
                            </button>
                          </div>
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

      {/* --- POPUP CONFIRMATION --- */}
      {itemToDelete !== null && (
        // Overlay nền đen mờ
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          {/* Hộp thoại chính */}
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-[hsl(var(--card-foreground))] w-full max-w-md rounded-lg shadow-xl p-6 scale-100 animate-in zoom-in-95 duration-200">
            {/* Header Popup */}
            <div className="flex flex-col items-center text-center sm:text-left sm:items-start mb-4">
              <div className="flex items-center gap-2 text-red-600 mb-2">
                <AlertTriangle className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Confirm Removal</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Are you sure you want to remove this item from your watchlist?
                This action cannot be undone.
              </p>
            </div>

            {/* Buttons Popup */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 shadow-sm transition-colors"
              >
                Remove
              </button>
            </div>
          </div>

          {/* Click outside to close (Optional) */}
          <div
            className="absolute inset-0 -z-10"
            onClick={handleCancelDelete}
          />
        </div>
      )}
    </>
  );
};

export default WatchlistPage;

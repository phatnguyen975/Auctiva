import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Gavel, RotateCw } from "lucide-react";
import CountdownTimer from "../../../components/product/details/CountdownTimer";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";

interface Item {
  id: number;
  image: string;
  title: string;
  myBid: number;
  currentBid: number;
  isWinning: Boolean;
  timeLeft: Date;
  totalBids: number;
}

const MyBidsPage = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const [myBids, setMyBids] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyBids = async () => {
      // Call API
      // setMyBids(dumpyMyBids);
    };

    fetchMyBids();
  }, []);

  return (
    <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] flex flex-col gap-6 rounded-xl border border-[hsl(var(--border))] transition-colors duration-300 p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">My Bids</h2>
            <p className="text-muted-foreground">
              Active auctions you're bidding on
            </p>
          </div>
          <span
            className="inline-flex items-center bg-gray-200 justify-center rounded-md px-2 py-1 text-xm font-medium w-fit whitespace-nowrap 
                  text-primary border-primary shrink-0 gap-1"
          >
            {myBids.length} active
          </span>
        </div>

        {myBids.length === 0 ? (
          <div className="text-center py-16">
            <Gavel className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-semibold mb-2">No active bids</h3>
            <p className="text-muted-foreground mb-6">
              Start bidding on items you like
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
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <th className="h-10 px-2 text-left align-middle font-medium text-foreground whitespace-nowrap">
                      Product
                    </th>
                    <th className="h-10 px-2 text-left align-middle font-medium text-foreground whitespace-nowrap">
                      My Bid
                    </th>
                    <th className="h-10 px-2 text-left align-middle font-medium text-foreground whitespace-nowrap">
                      Current Bid
                    </th>
                    <th className="h-10 px-2 text-left align-middle font-medium text-foreground whitespace-nowrap">
                      Status
                    </th>
                    <th className="h-10 px-2 text-left align-middle font-medium text-foreground whitespace-nowrap">
                      Time Left
                    </th>
                    <th className="h-10 px-2 text-left align-middle font-medium text-foreground whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="[&_tr:last-child]:border-0">
                  {myBids.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      {/* Cột Product: Image + Title */}
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

                      {/* Cột My Bid */}
                      <td className="p-2 align-middle whitespace-nowrap font-bold">
                        ${item.myBid.toLocaleString()}
                      </td>

                      {/* Cột Current Bid */}
                      <td className="p-2 align-middle whitespace-nowrap font-bold text-primary">
                        ${item.currentBid.toLocaleString()}
                      </td>

                      {/* Cột Status: Badge tự chế bằng span */}
                      <td className="p-2 align-middle whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border ${
                            item.isWinning
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {item.isWinning ? "Winning" : "Outbid"}
                        </span>
                      </td>

                      {/* Cột Time Left */}
                      <td className="p-2 align-middle whitespace-nowrap">
                        <CountdownTimer endTime={item.timeLeft} compact />
                      </td>

                      {/* Cột Actions: Button theo style slate của mẫu */}
                      <td className="p-2 align-middle whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            className={`w-[80%] flex justify-center items-center rounded-md px-4 py-2 text-sm font-medium transition-colors shadow-sm hover:cursor-pointer ${
                              item.isWinning
                                ? "bg-slate-900 text-white hover:bg-slate-700"
                                : "bg-orange-300 text-slate-900 hover:bg-slate-300"
                            }`}
                            onClick={() => navigate(`/products/${item.id}`)}
                          >
                            {item.isWinning ? (
                              <>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </>
                            ) : (
                              <>
                                <RotateCw className="size-4 mr-1" /> Bid Again
                              </>
                            )}
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
  );
};

export default MyBidsPage;

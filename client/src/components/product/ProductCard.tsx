import { useNavigate } from "react-router-dom";
import { Heart, Hammer, Calendar } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import { formatPostDate } from "../../utils/date";
import { maskName } from "../../utils/masking";

interface ProductCardProps {
  id: string;
  image: string;
  title: string;
  currentBid: number;
  buyNowPrice?: number;
  topBidder: string;
  totalBids: number;
  postDate: Date;
  endDate: Date;
  isNew?: boolean;
  viewMode?: "grid" | "list";
}

export function ProductCard({
  id,
  image,
  title,
  currentBid,
  buyNowPrice,
  topBidder,
  totalBids,
  postDate,
  endDate,
  isNew = false,
  viewMode = "grid",
}: ProductCardProps) {
  const navigate = useNavigate();

  // List View Layout
  if (viewMode === "list") {
    return (
      <div className="sm:h-[270px] lg:h-[250px] bg-white overflow-hidden border border-gray-300 rounded-lg hover:shadow-md transition-shadow cursor-pointer group">
        <div
          className="w-full h-full flex flex-col sm:flex-row gap-6 p-4"
          onClick={() => navigate(`/products/${id}`)}
        >
          {/* Left: Product Image */}
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {isNew && (
              <div className="absolute top-2 left-2 bg-black px-3 py-1 text-white rounded-lg font-semibold">
                NEW
              </div>
            )}
            <button
              className="sm:hidden absolute text-gray-800 top-2 right-2 p-2 bg-gray-100 hover:bg-white rounded-lg cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <Heart className="size-5" />
            </button>
          </div>

          {/* Right: Product Information */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex flex-col justify-between gap-5 lg:gap-4 max-sm:mb-3">
              {/* Title & Watchlist */}
              <div className="flex items-start justify-between gap-4">
                <h3 className="line-clamp-2 text-xl lg:text-2xl font-semibold flex-1">
                  {title}
                </h3>
                <button
                  className="max-sm:hidden text-gray-800 top-2 right-2 p-2 hover:bg-gray-200 rounded-lg cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Heart className="size-5" />
                </button>
              </div>

              {/* Pricing Section */}
              <div className="flex items-center gap-8 lg:gap-16">
                <div>
                  <span className="text-sm lg:text-md font-medium text-muted-foreground block mb-1">
                    Current Bid
                  </span>
                  <span className="text-3xl font-bold text-primary">
                    ${currentBid.toLocaleString()}
                  </span>
                </div>
                {buyNowPrice && (
                  <div>
                    <span className="text-sm lg:text-md font-medium text-muted-foreground block mb-1">
                      Buy Now
                    </span>
                    <span className="text-2xl font-semibold">
                      ${buyNowPrice.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Bidding Information */}
              <div className="flex items-center gap-8 lg:gap-16 text-md text-gray-800">
                <div className="flex items-center gap-1">
                  <Hammer className="size-4" />
                  <span className="font-medium">{totalBids} bids</span>
                </div>
                <div className="flex gap-1">
                  Top:
                  <span className="font-medium">{maskName(topBidder)}</span>
                </div>
              </div>
            </div>

            {/* End Date & Post Date */}
            <div className="flex items-center justify-between gap-4 pt-3 border-t">
              <CountdownTimer endDate={endDate} viewMode={viewMode} />
              {endDate && (
                <div className="flex items-center gap-1 text-sm whitespace-nowrap">
                  <Calendar className="size-4" />
                  <span>{formatPostDate(postDate)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View Layout (default)
  return (
    <div className="bg-white h-[620px] md:h-[520px] lg:h-[350px] overflow-hidden hover:shadow-md border border-gray-300 rounded-lg transition-shadow cursor-pointer group">
      <div
        className="relative w-full h-full flex flex-col"
        onClick={() => navigate(`/products/${id}`)}
      >
        {/* Product Image */}
        <div className="aspect-square relative overflow-hidden border-b text-gray-300">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {isNew && (
            <div className="absolute top-2 left-2 px-3 py-1 bg-black text-white text-sm rounded-lg font-semibold">
              NEW
            </div>
          )}
          <button
            className="absolute text-gray-800 top-2 right-2 p-2 bg-gray-100 hover:bg-white rounded-lg cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <Heart className="size-4" />
          </button>
        </div>

        {/* Product Information */}
        <div className="h-full p-9 md:p-6 lg:p-3 flex flex-col justify-between gap-3">
          {/* Title */}
          <h3 className="line-clamp-2 font-semibold text-2xl md:text-xl lg:text-lg">
            {title}
          </h3>

          {/* Pricing */}
          <div className="flex items-center">
            <div className="w-full flex justify-between gap-3">
              <div className="items-start">
                <span className="text-lg md:text-md lg:text-sm font-medium block mb-1">
                  Current Bid
                </span>
                <span className="text-4xl md:text-3xl lg:text-2xl font-bold block">
                  ${currentBid.toLocaleString()}
                </span>
              </div>
              {buyNowPrice && (
                <div className="items-end">
                  <span className="text-lg md:text-md lg:text-sm font-medium block mb-1">
                    Buy Now
                  </span>
                  <span className="text-2xl md:text-xl lg:text-lg font-semibold block">
                    ${buyNowPrice.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Bidding Information */}
          <div className="flex items-center justify-between text-lg lg:text-xs text-gray-800">
            <div className="flex items-center gap-1">
              <Hammer className="size-5 lg:size-3" />
              <span>{totalBids} bids</span>
            </div>
            <span className="truncate">Top: {maskName(topBidder)}</span>
          </div>

          {/* Countdown and Posted Date */}
          <div className="flex items-center justify-between pt-7 md:pt-5 lg:pt-3 border-t">
            <CountdownTimer endDate={endDate} />
            {endDate && (
              <div className="flex items-center gap-1 text-lg lg:text-xs text-gray-800 whitespace-nowrap">
                <Calendar className="size-5 lg:size-3" />
                <span>{formatPostDate(postDate)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

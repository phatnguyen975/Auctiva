import { useNavigate } from "react-router-dom";
import { Heart, Hammer, Calendar } from "lucide-react";
import { formatPostDate } from "../utils/dateUtils";
import CountdownTimer from "./CountdownTimer";

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
      <div className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        <div
          className="flex gap-6 p-4"
          onClick={() => navigate(`/products/${id}`)}
        >
          {/* Left: Product Image */}
          <div className="relative shrink-0 w-48 h-48">
            <div className="w-full h-full bg-muted relative overflow-hidden rounded-lg">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {isNew && (
                <div className="absolute top-2 left-2 bg-primary px-2 py-1 text-primary-foreground font-semibold">
                  NEW
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Information */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            {/* Top Section: Title & Watchlist */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-xl font-semibold line-clamp-2 flex-1">
                  {title}
                </h3>
                <button
                  className="shrink-0 hover:bg-muted"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Heart className="h-5 w-5" />
                </button>
              </div>

              {/* Pricing Section */}
              <div className="flex items-center gap-8 mb-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground block mb-1">
                    Current Bid
                  </span>
                  <span className="text-3xl font-bold text-primary">
                    ${currentBid.toLocaleString()}
                  </span>
                </div>
                {buyNowPrice && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground block mb-1">
                      Buy Now
                    </span>
                    <span className="text-2xl font-semibold">
                      ${buyNowPrice.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Bidding Info */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1.5">
                  <Hammer className="size-4" />
                  <span className="font-medium">{totalBids} bids</span>
                </div>
                <div>
                  <span>
                    Top Bidder:{" "}
                    <span className="font-medium text-foreground">
                      {topBidder}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Section: Timer & Posted Date */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t">
              <div className="flex-1">
                <CountdownTimer endDate={endDate} />
              </div>
              {endDate && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground whitespace-nowrap">
                  <Calendar className="size-4" />
                  <span>Posted {formatPostDate(postDate)}</span>
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
    <div className="lg:h-[380px] overflow-hidden hover:shadow-md border border-gray-300 rounded-lg transition-shadow cursor-pointer group">
      <div
        className="relative h-full flex flex-col"
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
            className="absolute text-gray-800 top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-lg cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <Heart className="size-4" />
          </button>
        </div>

        {/* Product Information */}
        <div className="h-full p-6 lg:p-3 flex flex-col justify-between gap-3">
          {/* Title */}
          <h3 className="line-clamp-2 font-semibold">{title}</h3>

          {/* Pricing */}
          <div className="flex items-center">
            <div className="w-full flex justify-between gap-3">
              <div className="items-start">
                <span className="text-sm font-medium block mb-1">
                  Current Bid
                </span>
                <span className="text-2xl font-bold block">
                  ${currentBid.toLocaleString()}
                </span>
              </div>
              {buyNowPrice && (
                <div className="items-end">
                  <span className="text-sm font-medium block mb-1">
                    Buy Now
                  </span>
                  <span className="text-lg font-semibold block">
                    ${buyNowPrice.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Bidding Information */}
          <div className="flex items-center justify-between text-sm text-gray-800">
            <div className="flex items-center gap-1">
              <Hammer className="size-4" />
              <span>{totalBids} bids</span>
            </div>
            <span className="truncate">Top: {topBidder}</span>
          </div>

          {/* Countdown and Posted Date */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex-1">
              <CountdownTimer endDate={endDate} />
            </div>
            {endDate && (
              <div className="flex items-center gap-1 text-xs text-gray-800 whitespace-nowrap">
                <Calendar className="size-3" />
                <span>{formatPostDate(postDate)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

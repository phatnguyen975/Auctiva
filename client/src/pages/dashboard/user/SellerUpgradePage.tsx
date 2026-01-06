import { useState } from "react";
import toast from "react-hot-toast";

import { TrendingUp, Package, Trophy, Award, Clock } from "lucide-react";

import { axiosInstance } from "../../../lib/axios";
import { getHeaders } from "../../../utils/getHeaders";

const SellerUpgradePage = () => {
  const [upgradeRequested, setUpgradeRequested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // API function to request seller upgrade
  const requestSellerUpgrade = async () => {
    try {
      setIsLoading(true);

      const headers = getHeaders();
      const response = await axiosInstance.post(
        "/seller-upgrade-requests",
        null,
        {
          headers,
        }
      );

      if (response.status === 201) {
        setUpgradeRequested(true);
        toast.success("Yêu cầu nâng cấp đã được gửi thành công!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể gửi yêu cầu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestUpgrade = () => {
    requestSellerUpgrade();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Upgrade to Seller</h2>
        <p className="text-[hsl(var(--muted-foreground))]">
          Start selling on Auctiva
        </p>
      </div>

      <div className="p-8 bg-gradient-to-br from-[hsl(var(--primary)/0.05)] to-[hsl(var(--primary)/0.1)] border-[hsl(var(--primary)/0.2)] border rounded-xl transition-colors duration-300">
        <div className="text-center max-w-2xl mx-auto space-y-6">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[hsl(var(--primary)/0.1)] rounded-full mb-4">
            <TrendingUp className="h-10 w-10 text-[hsl(var(--primary))]" />
          </div>

          {/* Title & Description */}
          <h3 className="text-2xl font-bold">Become a Seller Today</h3>
          <p className="text-[hsl(var(--muted-foreground))] text-lg">
            Unlock the power to list and sell your items on Auctiva's
            marketplace
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
            <div className="text-center">
              <div className="bg-[hsl(var(--primary)/0.1)] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="h-6 w-6 text-[hsl(var(--primary))]" />
              </div>
              <h4 className="font-semibold mb-2">List Items</h4>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Create unlimited auction listings
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[hsl(var(--primary)/0.1)] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="h-6 w-6 text-[hsl(var(--primary))]" />
              </div>
              <h4 className="font-semibold mb-2">Reach Buyers</h4>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Connect with thousands of bidders
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[hsl(var(--primary)/0.1)] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="h-6 w-6 text-[hsl(var(--primary))]" />
              </div>
              <h4 className="font-semibold mb-2">7-Day Trial</h4>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Start with a free trial period
              </p>
            </div>
          </div>

          {/* Trial Info Box */}
          <div className="bg-[hsl(var(--card))] p-6 rounded-lg border border-[hsl(var(--border))]">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-5 w-5 text-[hsl(var(--primary))]" />
              <h4 className="font-semibold">7-Day Free Trial</h4>
            </div>
            <p className="text-sm text-[hsl(var(--muted-foreground))] text-left">
              Your seller privileges will last for 7 days from approval. During
              this time, you can create and manage unlimited listings. After
              expiry, you can still manage existing listings but cannot create
              new ones.
            </p>
          </div>

          {/* Action Button or Status */}
          {!upgradeRequested ? (
            <button
              onClick={handleRequestUpgrade}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-lg font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-[hsl(var(--ring)/0.5)] focus-visible:ring-[3px] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary)/0.9)] h-10 px-8 py-6 hover:cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Clock className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <TrendingUp className="h-5 w-5" />
                  Request Seller Rights
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center justify-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-500" />
              <div className="text-left">
                <p className="font-semibold text-amber-900 dark:text-amber-100">
                  Request Pending
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  We'll review your request within 24 hours
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerUpgradePage;

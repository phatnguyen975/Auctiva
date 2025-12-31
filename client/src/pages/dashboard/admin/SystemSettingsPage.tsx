import { useState, useEffect } from "react";
import { Info, Loader2 } from "lucide-react";
import { axiosInstance } from "../../../lib/axios";

interface SystemSettings {
  autoExtensionTrigger: number;
  extensionDuration: number;
  newBadgeDuration: number;
  minSellerRating: number;
  minAccountAge: number;
  platformFee: number;
  minBidStep: number;
}

const SystemSettingsPage = () => {
  // Auto-Extension Settings
  const [autoExtensionTrigger, setAutoExtensionTrigger] = useState("5");
  const [extensionDuration, setExtensionDuration] = useState("10");
  const [newBadgeDuration, setNewBadgeDuration] = useState("5");

  // Platform Settings
  const [minSellerRating, setMinSellerRating] = useState("80");
  const [minAccountAge, setMinAccountAge] = useState("30");
  const [platformFee, setPlatformFee] = useState("5");
  const [minBidStep, setMinBidStep] = useState("1");

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch system settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  // Fetch system settings from API
  const fetchSettings = async () => {
    setIsLoading(true);
    setError(null);

    // Mock: Use default values (remove this when backend is ready)
    const mockSettings: SystemSettings = {
      autoExtensionTrigger: 5,
      extensionDuration: 10,
      newBadgeDuration: 5,
      minSellerRating: 80,
      minAccountAge: 30,
      platformFee: 5,
      minBidStep: 1,
    };

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    setAutoExtensionTrigger(mockSettings.autoExtensionTrigger.toString());
    setExtensionDuration(mockSettings.extensionDuration.toString());
    setNewBadgeDuration(mockSettings.newBadgeDuration.toString());
    setMinSellerRating(mockSettings.minSellerRating.toString());
    setMinAccountAge(mockSettings.minAccountAge.toString());
    setPlatformFee(mockSettings.platformFee.toString());
    setMinBidStep(mockSettings.minBidStep.toString());
    setIsLoading(false);

    /* TODO: Uncomment when API is ready
    try {
      const response = await axiosInstance.get("/api/admin/system-settings");
      const settings: SystemSettings = response.data;
      
      setAutoExtensionTrigger(settings.autoExtensionTrigger.toString());
      setExtensionDuration(settings.extensionDuration.toString());
      setNewBadgeDuration(settings.newBadgeDuration.toString());
      setMinSellerRating(settings.minSellerRating.toString());
      setMinAccountAge(settings.minAccountAge.toString());
      setPlatformFee(settings.platformFee.toString());
      setMinBidStep(settings.minBidStep.toString());
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch settings");
    } finally {
      setIsLoading(false);
    }
    */
  };

  // Save auto-extension settings
  const handleSaveAutoExtension = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Mock: Simulate success (remove this when backend is ready)
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSuccessMessage("Auto-extension settings saved successfully!");
    setTimeout(() => setSuccessMessage(null), 3000);
    setIsLoading(false);

    /* TODO: Uncomment when API is ready
    try {
      await axiosInstance.patch("/api/admin/system-settings/auto-extension", {
        autoExtensionTrigger: parseInt(autoExtensionTrigger),
        extensionDuration: parseInt(extensionDuration),
        newBadgeDuration: parseInt(newBadgeDuration),
      });
      
      setSuccessMessage("Auto-extension settings saved successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save auto-extension settings");
    } finally {
      setIsLoading(false);
    }
    */
  };

  // Reset to default values
  const handleResetToDefaults = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Mock: Reset to defaults (remove this when backend is ready)
    await new Promise((resolve) => setTimeout(resolve, 500));
    setAutoExtensionTrigger("5");
    setExtensionDuration("10");
    setNewBadgeDuration("5");
    setSuccessMessage("Settings reset to defaults!");
    setTimeout(() => setSuccessMessage(null), 3000);
    setIsLoading(false);

    /* TODO: Uncomment when API is ready
    try {
      const response = await axiosInstance.post("/api/admin/system-settings/reset-defaults");
      const settings: SystemSettings = response.data;
      
      setAutoExtensionTrigger(settings.autoExtensionTrigger.toString());
      setExtensionDuration(settings.extensionDuration.toString());
      setNewBadgeDuration(settings.newBadgeDuration.toString());
      
      setSuccessMessage("Settings reset to defaults!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset settings");
    } finally {
      setIsLoading(false);
    }
    */
  };

  // Save platform settings
  const handleSavePlatformSettings = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Mock: Simulate success (remove this when backend is ready)
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSuccessMessage("Platform settings saved successfully!");
    setTimeout(() => setSuccessMessage(null), 3000);
    setIsLoading(false);

    /* TODO: Uncomment when API is ready
    try {
      await axiosInstance.patch("/api/admin/system-settings/platform", {
        minSellerRating: parseInt(minSellerRating),
        minAccountAge: parseInt(minAccountAge),
        platformFee: parseFloat(platformFee),
        minBidStep: parseFloat(minBidStep),
      });
      
      setSuccessMessage("Platform settings saved successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save platform settings");
    } finally {
      setIsLoading(false);
    }
    */
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <h2 className="text-2xl lg:text-3xl font-bold">System Settings</h2>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--primary))]" />
        </div>
      )}

      {/* Auto-Extension Configuration */}
      <div className="bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--border))] p-4 sm:p-6">
        <h3 className="font-semibold mb-6">Auto-Extension Configuration</h3>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">
          Configure global parameters for auction auto-extension feature. These
          settings will apply to all new auctions.
        </p>

        <div className="space-y-6">
          {/* Auto-Extension Trigger Time */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label
                  htmlFor="trigger-time"
                  className="text-sm font-medium leading-none"
                >
                  Auto-Extension Trigger Time
                </label>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                  Time before auction end when last-minute bids trigger
                  extension
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-[hsl(var(--secondary))] px-2.5 py-0.5 text-xs font-semibold text-[hsl(var(--secondary-foreground))]">
                {autoExtensionTrigger} minutes
              </span>
            </div>
            <div className="flex gap-4 items-center">
              <input
                id="trigger-time"
                type="number"
                value={autoExtensionTrigger}
                onChange={(e) => setAutoExtensionTrigger(e.target.value)}
                min="1"
                max="30"
                className="max-w-[200px] flex h-10 w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm ring-offset-[hsl(var(--background))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2"
              />
              <span className="text-sm text-[hsl(var(--muted-foreground))]">
                minutes before end
              </span>
            </div>
            <div className="bg-[hsl(var(--muted))]/50 rounded-lg p-4 text-sm">
              <p className="font-medium mb-1">Current Setting:</p>
              <p className="text-[hsl(var(--muted-foreground))]">
                If a bid is placed in the last {autoExtensionTrigger} minutes of
                an auction, the auction will be automatically extended.
              </p>
            </div>
          </div>

          {/* Extension Duration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label
                  htmlFor="extension-duration"
                  className="text-sm font-medium leading-none"
                >
                  Extension Duration
                </label>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                  How much time is added when auto-extension is triggered
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-[hsl(var(--secondary))] px-2.5 py-0.5 text-xs font-semibold text-[hsl(var(--secondary-foreground))]">
                {extensionDuration} minutes
              </span>
            </div>
            <div className="flex gap-4 items-center">
              <input
                id="extension-duration"
                type="number"
                value={extensionDuration}
                onChange={(e) => setExtensionDuration(e.target.value)}
                min="1"
                max="60"
                className="max-w-[200px] flex h-10 w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm ring-offset-[hsl(var(--background))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2"
              />
              <span className="text-sm text-[hsl(var(--muted-foreground))]">
                minutes added
              </span>
            </div>
            <div className="bg-[hsl(var(--muted))]/50 rounded-lg p-4 text-sm">
              <p className="font-medium mb-1">Current Setting:</p>
              <p className="text-[hsl(var(--muted-foreground))]">
                When triggered, the auction will be extended by{" "}
                {extensionDuration} minutes from the time of the bid.
              </p>
            </div>
          </div>

          {/* New Badge Duration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label
                  htmlFor="new-badge-duration"
                  className="text-sm font-medium leading-none"
                >
                  New Badge Duration
                </label>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                  Duration for which the "New" badge is displayed on products
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-[hsl(var(--secondary))] px-2.5 py-0.5 text-xs font-semibold text-[hsl(var(--secondary-foreground))]">
                {newBadgeDuration} minutes
              </span>
            </div>
            <div className="flex gap-4 items-center">
              <input
                id="new-badge-duration"
                type="number"
                value={newBadgeDuration}
                onChange={(e) => setNewBadgeDuration(e.target.value)}
                min="1"
                max="30"
                className="max-w-[200px] flex h-10 w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm ring-offset-[hsl(var(--background))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2"
              />
              <span className="text-sm text-[hsl(var(--muted-foreground))]">
                minutes
              </span>
            </div>
            <div className="bg-[hsl(var(--muted))]/50 rounded-lg p-4 text-sm">
              <p className="font-medium mb-1">Current Setting:</p>
              <p className="text-[hsl(var(--muted-foreground))]">
                The "New" badge will be displayed on products for{" "}
                {newBadgeDuration} minutes after their listing.
              </p>
            </div>
          </div>

          {/* Example Scenario */}
          <div className="bg-[hsl(var(--primary))]/5 border border-[hsl(var(--primary))]/20 rounded-lg p-4">
            <h4 className="font-semibold text-[hsl(var(--primary))] mb-2 flex items-center gap-2">
              <Info className="h-5 w-5" />
              Example Scenario
            </h4>
            <p className="text-sm">
              An auction is set to end at 3:00 PM. A bid is placed at 2:
              {60 - parseInt(autoExtensionTrigger)} PM (within the last{" "}
              {autoExtensionTrigger} minutes). The auction will automatically
              extend to 3:{extensionDuration.padStart(2, "0")} PM.
            </p>
          </div>

          {/* Save Button */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSaveAutoExtension}
              disabled={isLoading}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90 h-11 px-8 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Settings"
              )}
            </button>
            <button
              onClick={handleResetToDefaults}
              disabled={isLoading}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-[hsl(var(--input))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] h-11 px-8 cursor-pointer"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>

      {/* Platform Settings */}
      <div className="bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--border))] p-4 sm:p-6">
        <h3 className="font-semibold mb-4">Platform Settings</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="min-seller-rating"
                className="text-sm font-medium leading-none"
              >
                Minimum Seller Rating (%)
              </label>
              <input
                id="min-seller-rating"
                type="number"
                value={minSellerRating}
                onChange={(e) => setMinSellerRating(e.target.value)}
                className="mt-2 flex h-10 w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm ring-offset-[hsl(var(--background))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2"
              />
            </div>
            <div>
              <label
                htmlFor="min-account-age"
                className="text-sm font-medium leading-none"
              >
                Minimum Account Age (days)
              </label>
              <input
                id="min-account-age"
                type="number"
                value={minAccountAge}
                onChange={(e) => setMinAccountAge(e.target.value)}
                className="mt-2 flex h-10 w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm ring-offset-[hsl(var(--background))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="platform-fee"
                className="text-sm font-medium leading-none"
              >
                Platform Fee (%)
              </label>
              <input
                id="platform-fee"
                type="number"
                value={platformFee}
                onChange={(e) => setPlatformFee(e.target.value)}
                step="0.1"
                className="mt-2 flex h-10 w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm ring-offset-[hsl(var(--background))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2"
              />
            </div>
            <div>
              <label
                htmlFor="min-bid-step"
                className="text-sm font-medium leading-none"
              >
                Minimum Bid Step ($)
              </label>
              <input
                id="min-bid-step"
                type="number"
                value={minBidStep}
                onChange={(e) => setMinBidStep(e.target.value)}
                step="0.1"
                className="mt-2 flex h-10 w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm ring-offset-[hsl(var(--background))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2"
              />
            </div>
          </div>
          <button
            onClick={handleSavePlatformSettings}
            disabled={isLoading}
            className="mt-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90 h-10 px-4 py-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Platform Settings"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsPage;

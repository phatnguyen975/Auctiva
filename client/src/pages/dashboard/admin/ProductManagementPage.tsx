import { useState, useEffect } from "react";
import { Eye, Trash2, Loader2, Search, Flag } from "lucide-react";
import { axiosInstance } from "../../../lib/axios";

// Types
interface Product {
  id: string;
  title: string;
  seller: string;
  category: string;
  currentBid: number;
  status: "active" | "flagged" | "ended" | "removed";
  endDate: string;
}

const ProductManagementPage = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      title: "Premium Wireless Headphones",
      seller: "tech_seller",
      category: "Electronics > Audio",
      currentBid: 245,
      status: "active",
      endDate: "2025-11-22",
    },
    {
      id: "2",
      title: "Vintage Watch",
      seller: "luxury_items",
      category: "Fashion > Watches",
      currentBid: 1250,
      status: "active",
      endDate: "2025-11-23",
    },
    {
      id: "3",
      title: "Gaming Laptop",
      seller: "tech_hub",
      category: "Electronics > Laptops",
      currentBid: 1890,
      status: "flagged",
      endDate: "2025-11-24",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Confirm Dialog State
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "remove" | "flag" | "unflag";
    productId: string;
    productTitle: string;
    currentStatus?: string;
  } | null>(null);

  // ============ API CALLS ============

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axiosInstance.get("/api/admin/products", {
        params: {
          search: searchQuery || undefined,
        },
      });

      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  // Remove product
  const removeProduct = async (productId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axiosInstance.delete(
        `/api/admin/products/${productId}`
      );

      if (response.data.success) {
        setError(null);
        // Refresh products list
        await fetchProducts();
        // Close dialogs
        setIsConfirmDialogOpen(false);
        setIsViewDialogOpen(false);
      }
    } catch (err: any) {
      console.error("Error removing product:", err);
      setError(err.response?.data?.message || "Failed to remove product");
    } finally {
      setIsLoading(false);
    }
  };

  // Flag/Unflag product
  const toggleProductFlag = async (
    productId: string,
    currentStatus: string
  ) => {
    const newStatus = currentStatus === "flagged" ? "active" : "flagged";

    try {
      setIsLoading(true);
      setError(null);

      const response = await axiosInstance.patch(
        `/api/admin/products/${productId}/flag`,
        {
          status: newStatus,
        }
      );

      if (response.data.success) {
        setError(null);
        // Refresh products list
        await fetchProducts();
        // Close dialogs
        setIsConfirmDialogOpen(false);
        setIsViewDialogOpen(false);
      }
    } catch (err: any) {
      const action = newStatus === "flagged" ? "flag" : "unflag";
      console.error(`Error ${action}ging product:`, err);
      setError(err.response?.data?.message || `Failed to ${action} product`);
    } finally {
      setIsLoading(false);
    }
  };

  // Get product details
  // const getProductDetails = async (productId: string) => {
  //   try {
  //     setIsLoading(true);
  //     setError(null);

  //     const response = await axiosInstance.get(
  //       `/api/admin/products/${productId}`
  //     );

  //     if (response.data.success) {
  //       setSelectedProduct(response.data.data);
  //       setIsViewDialogOpen(true);
  //     }
  //   } catch (err: any) {
  //     console.error("Error fetching product details:", err);
  //     setError(
  //       err.response?.data?.message || "Failed to fetch product details"
  //     );
  //     alert(
  //       "Error: " +
  //         (err.response?.data?.message || "Failed to fetch product details")
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // Fetch products on component mount
  useEffect(() => {
    // Uncomment when API is ready
    // fetchProducts();
  }, []);

  // ============ HANDLERS ============

  const handleSearch = () => {
    fetchProducts();
  };

  const handleViewProduct = (product: Product) => {
    // For now, use local data. When API is ready, call getProductDetails(product.id)
    setSelectedProduct(product);
    setIsViewDialogOpen(true);
  };

  const handleRemoveProduct = (product: Product) => {
    setConfirmAction({
      type: "remove",
      productId: product.id,
      productTitle: product.title,
    });
    setIsConfirmDialogOpen(true);
  };

  const handleToggleFlag = (product: Product) => {
    const actionType = product.status === "flagged" ? "unflag" : "flag";
    setConfirmAction({
      type: actionType,
      productId: product.id,
      productTitle: product.title,
      currentStatus: product.status,
    });
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    if (confirmAction.type === "remove") {
      await removeProduct(confirmAction.productId);
    } else {
      await toggleProductFlag(
        confirmAction.productId,
        confirmAction.currentStatus || "active"
      );
    }
  };

  // Filter products based on search query (client-side filtering for demo)
  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl lg:text-3xl font-bold">Product Management</h2>

        {/* Search */}
        <div className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            <input
              type="text"
              placeholder="Search by title, seller, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex h-10 w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-white hover:bg-slate-900/90 h-10 px-4 py-2 cursor-pointer"
          >
            Search
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-xl border border-[hsl(var(--border))] overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--muted-foreground))]" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-[hsl(var(--muted-foreground))]">
            <p>No products found.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[hsl(var(--border))]">
                <th className="h-12 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
                  Title
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
                  Seller
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
                  Category
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
                  Current Bid
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
                  Status
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
                  End Date
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-[hsl(var(--muted-foreground))]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-[hsl(var(--border))] transition-colors hover:bg-[hsl(var(--muted)/0.5)]"
                >
                  <td className="p-4 align-middle font-medium">
                    {product.title}
                  </td>
                  <td className="p-4 align-middle">{product.seller}</td>
                  <td className="p-4 align-middle text-sm text-[hsl(var(--muted-foreground))]">
                    {product.category}
                  </td>
                  <td className="p-4 align-middle font-semibold">
                    ${product.currentBid}
                  </td>
                  <td className="p-4 align-middle">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.status === "active"
                          ? "bg-slate-900 text-white"
                          : product.status === "flagged"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          : product.status === "ended"
                          ? "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                          : "bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="p-4 align-middle">{product.endDate}</td>
                  <td className="p-4 align-middle">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewProduct(product)}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] h-9 px-3 cursor-pointer"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleRemoveProduct(product)}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-500 text-white hover:bg-red-600 h-9 px-3 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* View Product Dialog */}
      {isViewDialogOpen && selectedProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setIsViewDialogOpen(false)}
        >
          <div
            className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-lg shadow-lg w-full max-w-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Product Details</h3>
                <button
                  onClick={() => setIsViewDialogOpen(false)}
                  className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Title
                    </p>
                    <p className="font-medium">{selectedProduct.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Seller
                    </p>
                    <p className="font-medium">{selectedProduct.seller}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Category
                    </p>
                    <p className="font-medium">{selectedProduct.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Current Bid
                    </p>
                    <p className="font-medium">${selectedProduct.currentBid}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Status
                    </p>
                    <p className="font-medium capitalize">
                      {selectedProduct.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      End Date
                    </p>
                    <p className="font-medium">{selectedProduct.endDate}</p>
                  </div>
                </div>

                {/* Additional product info can be added here */}
                <div className="pt-4 border-t border-[hsl(var(--border))]">
                  <h4 className="font-semibold mb-3">Actions</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        handleToggleFlag(selectedProduct);
                        setIsViewDialogOpen(false);
                      }}
                      disabled={isLoading}
                      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 cursor-pointer ${
                        selectedProduct.status === "flagged"
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-amber-500 text-white hover:bg-amber-600"
                      }`}
                    >
                      <Flag className="h-4 w-4 mr-2" />
                      {selectedProduct.status === "flagged"
                        ? "Unflag Product"
                        : "Flag Product"}
                    </button>
                    <button
                      onClick={() => {
                        handleRemoveProduct(selectedProduct);
                        setIsViewDialogOpen(false);
                      }}
                      disabled={isLoading}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-500 text-white hover:bg-red-600 h-10 px-4 py-2 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Product
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setIsViewDialogOpen(false)}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] h-10 px-4 py-2 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {isConfirmDialogOpen && confirmAction && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={() => setIsConfirmDialogOpen(false)}
        >
          <div
            className="bg-[hsl(var(--card))] rounded-lg shadow-lg w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Confirm Action</h2>
            <p className="text-[hsl(var(--muted-foreground))] mb-6">
              {confirmAction.type === "remove" && (
                <>
                  Are you sure you want to remove{" "}
                  <strong>{confirmAction.productTitle}</strong>? This action
                  cannot be undone.
                </>
              )}
              {confirmAction.type === "flag" && (
                <>
                  Are you sure you want to flag{" "}
                  <strong>{confirmAction.productTitle}</strong> as
                  inappropriate?
                </>
              )}
              {confirmAction.type === "unflag" && (
                <>
                  Are you sure you want to unflag{" "}
                  <strong>{confirmAction.productTitle}</strong>?
                </>
              )}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsConfirmDialogOpen(false)}
                disabled={isLoading}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] h-10 px-4 py-2 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={isLoading}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 cursor-pointer ${
                  confirmAction.type === "remove"
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : confirmAction.type === "unflag"
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-amber-500 text-white hover:bg-amber-600"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {confirmAction.type === "remove" && "Remove"}
                    {confirmAction.type === "flag" && "Flag"}
                    {confirmAction.type === "unflag" && "Unflag"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagementPage;

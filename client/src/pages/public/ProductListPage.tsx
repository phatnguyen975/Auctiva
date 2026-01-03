import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Grid3x3, List } from "lucide-react";
import type { Product } from "../../types/product";
import { ProductCard } from "../../components/product/ProductCard";
import Breadcrumbs from "../../components/product/Breadcrumbs";
import SideBar from "../../components/product/SideBar";
import SortBar, { sortOptions } from "../../components/product/SortBar";
import Pagination from "../../components/product/Pagination";
import { mapProductToCard } from "../../utils/product";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { axiosInstance } from "../../lib/axios";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

const PAGE_SIZE = 9;

const ProductListPage = () => {
  const authUser = useSelector((state: RootState) => state.auth.authUser);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const [searchParams, setSearchParams] = useSearchParams();

  const sort = searchParams.get("sort") || "";
  const page = Number(searchParams.get("page")) || 1;
  const keyword = searchParams.get("keyword") || "";
  const categoryIds = searchParams.get("categoryIds") || "";

  const sortOption = sortOptions.find((opt) => opt.value === sort);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    // sort
    if (sortOption?.sortBy && sortOption?.order) {
      params.set("sortBy", sortOption.sortBy);
      params.set("order", sortOption.order);
    }

    // pagination
    params.set("page", page.toString());
    params.set("limit", PAGE_SIZE.toString());

    // filter
    if (keyword) {
      params.set("keyword", keyword);
    }

    if (categoryIds) {
      params.set("categoryIds", categoryIds);
    }

    return params.toString();
  }, [sort, page, keyword, categoryIds]);

  const handleSortChange = (value: string) => {
    const nextParams = new URLSearchParams(searchParams);

    if (!value) {
      nextParams.delete("sort");
    } else {
      nextParams.set("sort", value);
    }

    nextParams.set("page", "1");
    setSearchParams(nextParams);
  };

  const handlePageChange = (value: number) => {
    const nextParams = new URLSearchParams(searchParams);

    if (value <= 1) {
      nextParams.delete("page");
    } else {
      nextParams.set("page", value.toString());
    }

    setSearchParams(nextParams);
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      const headers: HeadersInit = {
        "x-api-key": import.meta.env.VITE_API_KEY,
      };

      if (authUser && accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      const { data } = await axiosInstance.get(`/products?${queryString}`, { headers });

      if (data.success) {
        setProducts(data.data.products);
        setTotalPages(data.data.pagination.totalPages);
        setTotalResults(data.data.pagination.totalCount);
      }
    } catch (error: any) {
      console.error("Error fetching products:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [queryString]);

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: "Products", href: "/products" }]} />

      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <SideBar />

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Top Bar */}
          <div className="bg-white rounded-lg p-4 mb-6 shadow-sm flex items-center justify-between">
            <div className="text-gray-600 text-sm">
              Showing{" "}
              <span className="font-bold text-black">{products.length}</span> of{" "}
              <span className="font-bold text-black">{totalResults}</span>{" "}
              results
            </div>

            <div className="flex items-center gap-4">
              {/* Sort Bar */}
              <SortBar value={sort} onChange={handleSortChange} />

              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  className={`p-2 rounded-none cursor-pointer ${
                    viewMode === "grid" && "bg-black text-white"
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="size-4" />
                </button>
                <button
                  className={`p-2 rounded-none cursor-pointer ${
                    viewMode === "list" && "bg-black text-white"
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : products.length === 0 ? (
            <div className="text-gray-600 flex items-center justify-center">
              No Products
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6"
                  : "space-y-4"
              }
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  {...mapProductToCard(product)}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        </main>
      </div>
    </div>
  );
};

export default ProductListPage;

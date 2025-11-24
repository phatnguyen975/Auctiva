import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Grid3x3, List } from "lucide-react";
import type { Product } from "../../types/product";
import { ProductCard } from "../../components/product/ProductCard";
import Breadcrumbs from "../../components/product/Breadcrumbs";
import SideBar from "../../components/product/SideBar";
import SortBar, { sortOptions } from "../../components/product/SortBar";
import Pagination from "../../components/product/Pagination";
import { dummyAllProducts } from "../../assets/assets";

const PAGE_SIZE = 9;

const ProductListPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [totalPages, setTotalPages] = useState(8);

  const [searchParams, setSearchParams] = useSearchParams();

  const sort = searchParams.get("sort") || "";
  const page = Number(searchParams.get("page")) || 1;
  const category = searchParams.get("categoryId") || "";
  const keyword = searchParams.get("keyword") || "";

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
    if (category) {
      params.set("categoryId", category);
    }
    if (keyword) {
      params.set("keyword", keyword);
    }

    return params.toString();
  }, [sort, page, category, keyword]);

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

  const getALlProducts = async () => {
    // Call API
    setProducts(dummyAllProducts);
  };

  useEffect(() => {
    getALlProducts();
  }, [queryString]);

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs items={[]} />

      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <SideBar />

        {/* Main Content */}
        <main className="flex-1">
          {/* Top Bar */}
          <div className="bg-white rounded-lg p-4 mb-6 flex items-center justify-between">
            {/* <SideBar /> */}

            <div className="flex items-center gap-1">
              <span className="text-sm font-bold">
                {products.length}
              </span>
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
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6"
                : "space-y-4"
            }
          >
            {products.map((product) => (
              <ProductCard key={product.id} {...product} viewMode={viewMode} />
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
        </main>
      </div>
    </div>
  );
};

export default ProductListPage;

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Product } from "../../types/product";
import Breadcrumbs from "../../components/product/Breadcrumbs";
import SideBar from "../../components/product/Sidebar";
import { dummyAllProducts } from "../../assets/assets";
import Pagination from "../../components/product/Pagination";
import { ProductCard } from "../../components/product/ProductCard";
import SortBar from "../../components/product/SortBar";
import { Grid3x3, List } from "lucide-react";

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const getALlProducts = async () => {
    setProducts(dummyAllProducts);
  };

  useEffect(() => {
    getALlProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs items={[]} />

      <div className="flex gap-6">
        {/* Side Bar */}
        <SideBar />

        {/* Main Content */}
        <main className="flex-1">
          {/* Top Bar */}
          <div className="bg-white rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Showing {products.length} results
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort Bar */}
              <SortBar />

              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  className={`p-2 rounded-none cursor-pointer ${viewMode === "grid" && "bg-black text-white"}`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="size-4" />
                </button>
                <button
                  className={`p-2 rounded-none cursor-pointer ${viewMode === "list" && "bg-black text-white"}`}
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

          {/* Pagination */}
          <Pagination />
        </main>
      </div>
    </div>
  );
};

export default ProductListPage;

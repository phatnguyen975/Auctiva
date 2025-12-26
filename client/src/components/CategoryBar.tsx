import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import LoadingSpinner from "./ui/LoadingSpinner";
import type { Category } from "../types/category";

const CategoryBar = () => {
  const [categoryOpen, setCategoryOpen] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const { data } = await axiosInstance.get("/categories", {
          headers: { "x-api-key": import.meta.env.VITE_API_KEY },
        });

        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  return (
    <div className="w-full p-2 hidden md:flex items-center justify-center border-b border-gray-300 transition-colors duration-300">
      <div className="flex items-center justify-center gap-2 lg:gap-8">
        {loading ? (
          <LoadingSpinner />
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="relative"
              onMouseEnter={() => setCategoryOpen(category.id)}
              onMouseLeave={() => setCategoryOpen(null)}
            >
              {/* Main Categories */}
              <button
                className={`
                text-sm font-medium px-3 py-2 rounded-t-lg flex items-center gap-1 whitespace-nowrap
                transition-all duration-200 border-b-2 cursor-pointer
                ${
                  categoryOpen === category.id
                    ? "bg-gray-200"
                    : "border-transparent"
                }
                `}
                onClick={() => navigate(`/products?category=${category.slug}`)}
              >
                {category.name}
                <ChevronDown
                  className={`size-3 transition-transform duration-200 ${
                    categoryOpen === category.id && "rotate-180"
                  }`}
                />
              </button>

              {/* Sub Categories */}
              {categoryOpen === category.id && (
                <div
                  className="fixed top-0 min-w-[150px] bg-white border border-gray-300 rounded-b-lg shadow-sm z-50 max-h-[300px] overflow-y-auto"
                  style={{
                    top: "var(--dropdown-top)",
                    left: "var(--dropdown-left)",
                  }}
                  ref={(el) => {
                    if (el) {
                      const button = el.previousElementSibling as HTMLElement;
                      if (button) {
                        const rect = button.getBoundingClientRect();
                        el.style.setProperty(
                          "--dropdown-top",
                          `${rect.bottom}px`
                        );
                        el.style.setProperty(
                          "--dropdown-left",
                          `${rect.left}px`
                        );
                      }
                    }
                  }}
                >
                  {category.children.map((child) => (
                    <div
                      key={child.id}
                      className="w-full px-3 hover:bg-gray-200"
                    >
                      <button
                        className="w-full py-2 text-sm text-left cursor-pointer"
                        onClick={() =>
                          navigate(`/products?category=${child.slug}`)
                        }
                      >
                        {child.name}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryBar;

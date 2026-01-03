import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import LoadingSpinner from "./ui/LoadingSpinner";
import type { AppDispatch, RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../store/slices/categorySlice";

const CategoryBar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: categories,
    loaded,
    loading,
  } = useSelector((state: RootState) => state.categories);

  const [categoryOpen, setCategoryOpen] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      await dispatch(getCategories()).unwrap();
    } catch (error: any) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    if (!loaded) {
      fetchCategories();
    }
  }, [loaded, dispatch]);

  return (
    <div className="w-full p-2 hidden md:flex items-center justify-center border-b border-gray-300 transition-colors duration-300">
      <div className="flex items-center justify-center gap-2 lg:gap-8">
        {loading ? (
          <LoadingSpinner />
        ) : categories.length > 0 ? (
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
                onClick={() => {
                  const childIds = category.children.map((child) => child.id);
                  const params = childIds.join(",");
                  navigate(`/products?categoryIds=${params}`);
                }}
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
                          navigate(`/products?categoryIds=${child.id}`)
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
        ) : (
          <div>No categories</div>
        )}
      </div>
    </div>
  );
};

export default CategoryBar;

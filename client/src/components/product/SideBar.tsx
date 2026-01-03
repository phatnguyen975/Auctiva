import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { X, Menu, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { getCategories } from "../../store/slices/categorySlice";
import LoadingSpinner from "../ui/LoadingSpinner";

const Sidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    data: categories,
    loaded,
    loading,
  } = useSelector((state: RootState) => state.categories);

  const [categorySidebarOpen, setCategorySidebarOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const paramsIds = searchParams.get("categoryIds");
    if (paramsIds) {
      // Convert "1,2,3" to [1, 2, 3]
      const ids = paramsIds
        .split(",")
        .map((id) => Number(id))
        .filter((n) => !isNaN(n));
      setSelectedCategoryIds(ids);

      if (categories.length > 0) {
        const parentsToExpand = categories
          .filter((cat) => cat.children.some((child) => ids.includes(child.id)))
          .map((cat) => cat.name);
        setExpandedCategories((prev) => [
          ...new Set([...prev, ...parentsToExpand]),
        ]);
      }
    } else {
      setSelectedCategoryIds([]);
    }
  }, [searchParams, categories]);

  useEffect(() => {
    if (!loaded) {
      dispatch(getCategories()).unwrap().catch(console.error);
    }
  }, [loaded, dispatch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setCategorySidebarOpen(false);
      }
    };
    if (categorySidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [categorySidebarOpen]);

  const toggleCategory = (name: string) => {
    setExpandedCategories((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedCategoryIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id); // Remove
      } else {
        return [...prev, id]; // Add
      }
    });
  };

  const handleApply = () => {
    const nextParams = new URLSearchParams(searchParams);

    if (selectedCategoryIds.length > 0) {
      nextParams.set("categoryIds", selectedCategoryIds.join(","));
    } else {
      nextParams.delete("categoryIds");
    }

    nextParams.set("page", "1");

    setSearchParams(nextParams);
    setCategorySidebarOpen(false);
  };

  const handleReset = () => {
    setSelectedCategoryIds([]);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("categoryIds");
    nextParams.set("page", "1");
    setSearchParams(nextParams);
  };

  const renderCategoryList = () => (
    <div className="flex flex-col gap-2 px-2">
      {loading ? (
        <div className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-gray-500 text-sm italic">No categories</div>
      ) : (
        categories.map((category) => {
          const isExpanded = expandedCategories.includes(category.name);

          const selectedChildCount = category.children.filter((child) =>
            selectedCategoryIds.includes(child.id)
          ).length;

          return (
            <div key={category.id}>
              {/* Parent Category Button */}
              <button
                className="w-full flex justify-between items-center px-3 py-2 hover:bg-gray-100 transition-colors rounded-md cursor-pointer group"
                onClick={() => toggleCategory(category.name)}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-medium ${
                      selectedChildCount > 0
                        ? "text-indigo-600"
                        : "text-gray-700"
                    }`}
                  >
                    {category.name}
                  </span>
                  {selectedChildCount > 0 && (
                    <span className="bg-indigo-100 text-indigo-700 text-xs px-1.5 py-0.5 rounded-full font-bold">
                      {selectedChildCount}
                    </span>
                  )}
                </div>

                <ChevronRight
                  className={`size-4 text-gray-400 group-hover:text-gray-600 transition-transform ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                />
              </button>

              {/* Subcategories */}
              {isExpanded && (
                <div className="flex flex-col gap-1 mt-1 mb-2">
                  {category.children.map((child) => (
                    <label
                      key={child.id}
                      className="flex items-center gap-3 px-6 py-1.5 hover:bg-gray-50 cursor-pointer rounded-sm"
                    >
                      <input
                        type="checkbox"
                        className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        checked={selectedCategoryIds.includes(child.id)}
                        onChange={() => handleCheckboxChange(child.id)}
                      />
                      <span
                        className={`text-sm ${
                          selectedCategoryIds.includes(child.id)
                            ? "text-gray-900 font-medium"
                            : "text-gray-600"
                        }`}
                      >
                        {child.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-64 hidden md:block">
        <div className="sticky top-24 bg-white rounded-lg p-4 shadow-sm flex flex-col gap-2">
          <h3 className="font-semibold">Categories</h3>

          {renderCategoryList()}

          <div className="flex flex-col w-full gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={handleApply}
              className="w-full bg-black text-white font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Apply Filter
            </button>
            <button
              onClick={handleReset}
              className="w-full bg-gray-100 text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setCategorySidebarOpen(true)}
          className="px-4 py-2 bg-white rounded-lg border border-gray-300 flex gap-2 items-center text-sm font-medium text-gray-700 active:bg-gray-50 cursor-pointer"
        >
          <Menu className="size-4" />
          Categories{" "}
          {selectedCategoryIds.length > 0 && `(${selectedCategoryIds.length})`}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {categorySidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setCategorySidebarOpen(false)}
          />

          {/* Sidebar */}
          <div
            className="relative bg-white w-80 max-w-full h-full shadow-lg overflow-y-auto transition-transform transform translate-x-0"
            ref={sidebarRef}
          >
            {/* Header */}
            <div className="sticky top-0 w-full flex justify-between items-center px-4 py-2.5 shadow-sm bg-white">
              <h2 className="text-lg font-bold">All Categories</h2>
              <button
                className="p-2 hover:bg-gray-200 rounded-full cursor-pointer transition-colors"
                onClick={() => setCategorySidebarOpen(false)}
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 py-4">{renderCategoryList()}</div>

            <div className="sticky bottom-0 bg-white border-t border-gray-400 p-4 flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 border border-gray-300 text-gray-700 font-medium px-4 py-2.5 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={handleApply}
                className="flex-1 bg-black text-white font-medium px-4 py-2.5 rounded-lg hover:bg-gray-800 cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

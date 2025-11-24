import { useEffect, useRef, useState } from "react";
import { X, Menu, ChevronRight } from "lucide-react";
import { dummyAllCategories } from "../../assets/assets";

const Sidebar = () => {
  const [categorySidebarOpen, setCategorySidebarOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleCategory = (name: string) => {
    setExpandedCategories((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

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

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-64 hidden md:block">
        <div className="sticky top-24 bg-white rounded-lg p-4 flex flex-col gap-2">
          <h3 className="font-semibold">Categories</h3>

          <div className="flex flex-col gap-2 px-2">
            {dummyAllCategories.map((category) => {
              const isOpen = expandedCategories.includes(category.name);

              return (
                <div key={category.name}>
                  <button
                    className="w-full flex justify-between items-center px-3 py-2 hover:bg-gray-200 transition-colors rounded-md cursor-pointer"
                    onClick={() => toggleCategory(category.name)}
                  >
                    <span className="text-sm">{category.name}</span>
                    <ChevronRight
                      className={`size-4 ${
                        isOpen && "rotate-90 transition-transform"
                      }`}
                    />
                  </button>

                  {/* Subcategories */}
                  {isOpen &&
                    category.subcategories.map((subcategory) => (
                      <div
                        key={subcategory.name}
                        className="w-full flex gap-2 px-6 text-sm"
                      >
                        <input type="checkbox" className="accent-indigo-500" />
                        {subcategory.name}
                      </div>
                    ))}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col w-full gap-3">
            <button className="font-semibold border border-gray-300 px-3 py-1.5 rounded-lg cursor-pointer bg-gray-200 hover:bg-gray-300">
              Apply
            </button>
            <button className="font-semibold border border-gray-300 px-3 py-1.5 rounded-lg cursor-pointer bg-gray-200 hover:bg-gray-300">
              Reset
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setCategorySidebarOpen(true)}
          className="p-2 rounded-lg border font-semibold border-gray-300 flex gap-1 items-center text-sm cursor-pointer"
        >
          <Menu className="size-4" />
          Categories
        </button>
      </div>

      {categorySidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/50 transition-opacity" />

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

            {/* Categories */}
            <div className="flex flex-col gap-2 p-2">
              {dummyAllCategories.map((category) => {
                const isOpen = expandedCategories.includes(category.name);
                return (
                  <div key={category.name}>
                    <button
                      className="w-full flex justify-between items-center px-3 py-2 hover:bg-gray-200 transition-colors rounded-md cursor-pointer"
                      onClick={() => toggleCategory(category.name)}
                    >
                      <span className="text-sm">{category.name}</span>
                      <ChevronRight
                        className={`size-4 ${
                          isOpen && "rotate-90 transition-transform"
                        }`}
                      />
                    </button>

                    {/* Subcategories */}
                    {isOpen &&
                      category.subcategories.map((subcategory) => (
                        <div
                          key={subcategory.name}
                          className="w-full flex gap-2 px-6 text-sm"
                        >
                          <input
                            type="checkbox"
                            className="accent-indigo-500"
                          />
                          {subcategory.name}
                        </div>
                      ))}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col w-full p-3 gap-3">
              <button className="font-semibold border border-gray-300 px-3 py-1.5 rounded-lg cursor-pointer bg-gray-200 hover:bg-gray-300">
                Apply
              </button>
              <button className="font-semibold border border-gray-300 px-3 py-1.5 rounded-lg cursor-pointer bg-gray-200 hover:bg-gray-300">
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

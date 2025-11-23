import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { dummyCategories } from "../../assets/assets";

const CategoryBar = () => {
  const [categoryOpen, setCategoryOpen] = useState<string | null>(null);

  const navigate = useNavigate();

  return (
    <div className="w-full p-2 hidden md:flex items-center justify-center border-b border-gray-400 transition-colors duration-300">
      <div className="flex items-center justify-center gap-2 lg:gap-8">
        {dummyCategories.map((category) => (
          <div
            key={category.name}
            className="relative"
            onMouseEnter={() => setCategoryOpen(category.name)}
            onMouseLeave={() => setCategoryOpen(null)}
          >
            {/* Main Categories */}
            <button
              className={`
                text-sm font-medium px-3 py-2 rounded-t-lg flex items-center gap-1 whitespace-nowrap
                transition-all duration-200 border-b-2 cursor-pointer
                ${
                  categoryOpen === category.name
                    ? "bg-gray-200"
                    : "border-transparent"
                }
                `}
              onClick={() => navigate(`/products/${category.slug}`)}
            >
              {category.name}
              <ChevronDown
                className={`size-3 transition-transform duration-200 ${
                  categoryOpen === category.name && "rotate-180"
                }`}
              />
            </button>

            {/* Sub Categories */}
            {categoryOpen === category.name && (
              <div
                className="fixed top-0 w-60 bg-white border border-gray-300 rounded-b-lg shadow-sm z-50 max-h-[400px] overflow-y-auto"
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
                      el.style.setProperty("--dropdown-left", `${rect.left}px`);
                    }
                  }
                }}
              >
                <div className="p-2">
                  {category.subcategories.map((subcategory) => (
                    <div key={subcategory.name}>
                      <div className="p-2">
                        <p className="text-xs font-semibold tracking-wide">
                          {subcategory.name.toUpperCase()}
                        </p>
                      </div>
                      {subcategory.items.map((item, index) => (
                        <button
                          key={item}
                          onClick={() =>
                            navigate(`/products/${category.slug}/${index}`)
                          }
                          className="w-full text-left px-2 py-1 text-sm hover:bg-gray-200 rounded-sm cursor-pointer transition-colors"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBar;

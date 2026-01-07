import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type SortOption = {
  label: string;
  value: string;
  sortBy?: string | null;
  order?: "asc" | "desc" | null;
};

export const sortOptions: SortOption[] = [
  {
    label: "Sort: Default",
    value: "",
    sortBy: null,
    order: null,
  },
  {
    label: "Time: Ending soonest",
    value: "ending_soon",
    sortBy: "endDate",
    order: "asc",
  },
  {
    label: "Time: Newly listed",
    value: "newly_listed",
    sortBy: "postDate",
    order: "desc",
  },
  {
    label: "Price: Lowest first",
    value: "price_low",
    sortBy: "currentPrice",
    order: "asc",
  },
  {
    label: "Price: Highest first",
    value: "price_high",
    sortBy: "currentPrice",
    order: "desc",
  },
];

type SortBarProps = {
  value: string;
  onChange: (key: string) => void;
};

const SortBar = ({ value, onChange }: SortBarProps) => {
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setSortMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Desktop Sortbar */}
      <div className="hidden sm:flex">
        <div className="relative flex items-center text-sm">
          <select
            id="sort"
            className="appearance-none border border-gray-400 rounded-xl pl-3 pr-9 py-1.5"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3">
            <ChevronDown className="size-4" />
          </div>
        </div>
      </div>

      {/* Mobile Sortbar */}
      <div className="sm:hidden flex relative" ref={menuRef}>
        <button
          className={`flex items-center gap-1 text-sm px-2 py-1.5 cursor-pointer border ${
            sortMenuOpen
              ? "border-gray-200 bg-gray-200 rounded-t-lg"
              : "border-gray-300 rounded-lg"
          }`}
          onClick={() => setSortMenuOpen((prev) => !prev)}
        >
          Sort by
          <ChevronRight
            className={`size-4 ${
              sortMenuOpen && "rotate-90 transition-transform"
            }`}
          />
        </button>

        {/* Dropdown */}
        {sortMenuOpen && (
          <div className="absolute top-full right-0 min-w-[200px] bg-white border border-gray-300 rounded-b-lg rounded-tl-lg shadow-sm z-50">
            <div className="flex flex-col gap-2 items-start p-2">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  className="w-full text-left hover:bg-gray-200 px-2 py-1 rounded-md cursor-pointer"
                  onClick={() => {
                    onChange(opt.value);
                    setSortMenuOpen(false);
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SortBar;

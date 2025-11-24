import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const Pagination = ({ page, totalPages, onChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const createPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    startPage = Math.max(1, endPage - maxPagesToShow + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = createPageNumbers();

  return (
    <div className="w-full flex items-center justify-center gap-2 text-sm mt-6">
      {/* Previous */}
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className={`flex items-center gap-1 px-3 py-1 rounded-xl border ${
          page === 1
            ? "text-gray-400 border-gray-200 cursor-not-allowed"
            : "text-gray-700 border-gray-300 hover:bg-gray-200 cursor-pointer"
        }`}
      >
        <ChevronLeft className="size-4" />
        Prev
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-2.5 py-1 rounded-full border ${
            p === page
              ? "bg-indigo-500 text-white border-indigo-500"
              : "text-gray-700 border-gray-300 hover:bg-gray-200 cursor-pointer"
          } ${p === 1 && "px-3"}`}
        >
          {p}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className={`flex items-center gap-1 px-3 py-1 rounded-xl border ${
          page === totalPages
            ? "text-gray-400 border-gray-200 cursor-not-allowed"
            : "text-gray-700 border-gray-300 hover:bg-gray-200 cursor-pointer"
        }`}
      >
        Next
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
};

export default Pagination;

import { Link } from "react-router-dom";
import { ChevronRight, House } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600 font-medium">
        {/* Home Icon: Luôn trỏ về trang chủ */}
        <li>
          <Link
            to="/"
            className="flex items-center text-gray-500 hover:text-indigo-500 transition-colors"
          >
            <House className="size-5" />
          </Link>
        </li>

        {/* Render danh sách items */}
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRight className="size-4 text-gray-400" />

            {item.href ? (
              // Nếu có href -> Render Link
              <Link
                to={item.href}
                className="hover:text-indigo-500 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              // Nếu không có href -> Render Text (thường là item cuối cùng)
              <span className="text-indigo-600 font-semibold">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
import { Link } from "react-router-dom";
import { ChevronRight, House } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  id?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600 font-medium">
        <li>
          <Link
            to="/"
            className="flex items-center text-gray-500 hover:text-indigo-500"
          >
            <House className="size-5" />
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRight className="size-4 text-gray-400" />

            {item.id ? (
              <Link
                to={`/products?category=${item.id}`}
                className="hover:text-indigo-500 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-indigo-500">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

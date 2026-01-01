import { useState, useEffect } from "react";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { dummyAllCategories } from "../../../assets/assets";
import { axiosInstance } from "../../../lib/axios";

// Types
interface Subcategory {
  name: string;
  slug: string;
  productCount?: number;
}

interface Category {
  name: string;
  slug: string;
  productCount?: number;
  subcategories: Subcategory[];
}

interface ParentCategory {
  id: number;
  name: string;
}

const CategoryManagementPage = () => {
  const [categories, setCategories] = useState<Category[]>(dummyAllCategories);
  const [parentCategories, setParentCategories] = useState<ParentCategory[]>(
    []
  );
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "electronics",
  ]);
  const [categoryName, setCategoryName] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<{
    slug: string;
    name: string;
    parentSlug?: string;
  } | null>(null);

  // Mock product counts for each category
  const categoryProductCounts: Record<string, number> = {
    electronics: 1234,
    sports: 567,
    fashion: 2345,
    "health-beauty": 456,
    "toys-hobbies": 789,
  };

  const subcategoryProductCounts: Record<string, number> = {
    smartphones: 456,
    laptops: 234,
    headphones: 189,
    "pc-gaming": 355,
    football: 178,
    hiking: 234,
    cardio: 155,
    clothing: 678,
    jewelry: 891,
    toys: 776,
    skincare: 145,
    makeup: 189,
    "hair-care": 122,
    "action-figures": 234,
    "building-toys": 345,
    hobbies: 210,
  };

  const toggleCategory = (categorySlug: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categorySlug)
        ? prev.filter((slug) => slug !== categorySlug)
        : [...prev, categorySlug]
    );
  };

  // ============ API CALLS ============

  // Fetch parent categories (for dropdown in Add Category dialog)
  const fetchParentCategories = async () => {
    // Mock data (remove when API is ready)
    const mockParentCategories: ParentCategory[] = [
      { id: 1, name: "Electronics" },
      { id: 2, name: "Sports & Outdoors" },
      { id: 3, name: "Fashion" },
      { id: 4, name: "Health & Beauty" },
      { id: 5, name: "Toys & Hobbies" },
    ];

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    setParentCategories(mockParentCategories);

    /* TODO: Uncomment when API is ready
    try {
      const response = await axiosInstance.get("/api/categories/parent");

      if (response.data.success) {
        setParentCategories(response.data.data);
      }
    } catch (err: any) {
      console.error("Error fetching parent categories:", err);
      setError(err.response?.data?.message || "Failed to fetch parent categories");
    }
    */
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axiosInstance.get("/api/admin/categories");

      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      setError(err.response?.data?.message || "Failed to fetch categories");
      // Fallback to dummy data on error
      setCategories(dummyAllCategories);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new category
  const createCategory = async () => {
    if (!categoryName.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await axiosInstance.post("/api/admin/categories", {
        name: categoryName,
        parentId: parentCategoryId,
      });

      if (response.data.success) {
        alert("Category created successfully!");
        setCategoryName("");
        setParentCategoryId(null);
        setIsDialogOpen(false);
        // Refresh categories list
        await fetchCategories();
      }
    } catch (err: any) {
      console.error("Error creating category:", err);
      setError(err.response?.data?.message || "Failed to create category");
      alert(
        "Error: " + (err.response?.data?.message || "Failed to create category")
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Update category
  const updateCategory = async (
    slug: string,
    newName: string,
    parentSlug?: string
  ) => {
    if (!newName.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await axiosInstance.put(
        `/api/admin/categories/${slug}`,
        {
          name: newName,
          parentSlug: parentSlug || null,
        }
      );

      if (response.data.success) {
        alert("Category updated successfully!");
        setEditingCategory(null);
        // Refresh categories list
        await fetchCategories();
      }
    } catch (err: any) {
      console.error("Error updating category:", err);
      setError(err.response?.data?.message || "Failed to update category");
      alert(
        "Error: " + (err.response?.data?.message || "Failed to update category")
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Delete category
  const deleteCategory = async (
    slug: string,
    isSubcategory: boolean = false
  ) => {
    const confirmMessage = isSubcategory
      ? "Are you sure you want to delete this subcategory? This action cannot be undone."
      : "Are you sure you want to delete this category and all its subcategories? This action cannot be undone.";

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await axiosInstance.delete(
        `/api/admin/categories/${slug}`
      );

      if (response.data.success) {
        alert("Category deleted successfully!");
        // Refresh categories list
        await fetchCategories();
      }
    } catch (err: any) {
      console.error("Error deleting category:", err);
      setError(err.response?.data?.message || "Failed to delete category");
      alert(
        "Error: " + (err.response?.data?.message || "Failed to delete category")
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    // Fetch parent categories list for the dropdown
    fetchParentCategories();
    // Uncomment when API is ready
    // fetchCategories();
  }, []);

  // ============ HANDLERS ============

  const handleCreateCategory = () => {
    createCategory();
  };

  const handleEditCategory = (
    category: Category | Subcategory,
    parentSlug?: string
  ) => {
    setEditingCategory({
      slug: category.slug,
      name: category.name,
      parentSlug,
    });
    setCategoryName(category.name);
    // Note: If editing, you may need to map parentSlug to parentId from the API
    setParentCategoryId(null);
    setIsDialogOpen(true);
  };

  const handleDeleteCategory = (
    slug: string,
    isSubcategory: boolean = false
  ) => {
    deleteCategory(slug, isSubcategory);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setCategoryName("");
    setParentCategoryId(null);
    setEditingCategory(null);
    setError(null);
  };

  const handleDialogSubmit = () => {
    if (editingCategory) {
      // For editing, you may need to convert parentCategoryId back to slug or handle differently
      updateCategory(
        editingCategory.slug,
        categoryName,
        editingCategory.parentSlug
      );
    } else {
      createCategory();
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl lg:text-3xl font-bold">Category Management</h2>
        <button
          onClick={() => setIsDialogOpen(true)}
          disabled={isLoading}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-white hover:bg-slate-900/90 h-10 px-4 py-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-xl border border-[hsl(var(--border))] p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--muted-foreground))]" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-[hsl(var(--muted-foreground))]">
            <p>No categories found. Create your first category!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.slug}>
                <div>
                  <div className="flex items-center justify-between p-3 hover:bg-[hsl(var(--muted))] rounded-lg transition-colors">
                    <button
                      onClick={() => toggleCategory(category.slug)}
                      className="flex items-center gap-2 flex-1 text-left"
                    >
                      {expandedCategories.includes(category.slug) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <span className="font-medium">{category.name}</span>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]">
                        {categoryProductCounts[category.slug] || 0} products
                      </span>
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] h-9 px-3 cursor-pointer"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.slug)}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--destructive))] hover:text-[hsl(var(--destructive-foreground))] h-9 px-3 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subcategories */}
                  {expandedCategories.includes(category.slug) && (
                    <div className="ml-8 space-y-1 mt-2">
                      {category.subcategories.map((subcategory) => (
                        <div
                          key={subcategory.slug}
                          className="flex items-center justify-between p-2 hover:bg-[hsl(var(--muted))] rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-[hsl(var(--muted-foreground))]">
                              {subcategory.name}
                            </span>
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
                              {subcategoryProductCounts[subcategory.slug] || 0}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleEditCategory(subcategory, category.slug)
                              }
                              disabled={isLoading}
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] h-8 px-2 cursor-pointer"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteCategory(subcategory.slug, true)
                              }
                              disabled={isLoading}
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[hsl(var(--destructive))] hover:text-[hsl(var(--destructive-foreground))] h-8 px-2 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Category Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                  {editingCategory
                    ? "Update the category information."
                    : "Add a new category to the platform."}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-3 py-2 rounded-lg">
                  <p className="text-xs">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="category-name"
                    className="text-sm font-medium mb-2 block"
                  >
                    Category Name
                  </label>
                  <input
                    id="category-name"
                    type="text"
                    placeholder="Enter category name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="parent-category"
                    className="text-sm font-medium mb-2 block"
                  >
                    Parent Category (Optional)
                  </label>
                  <select
                    id="parent-category"
                    value={parentCategoryId === null ? "" : parentCategoryId}
                    onChange={(e) =>
                      setParentCategoryId(
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                    className="flex h-10 w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                  >
                    <option value="">None (Top-level category)</option>
                    {parentCategories.map((parent) => (
                      <option key={parent.id} value={parent.id}>
                        {parent.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2">
                    Select a parent category to create a subcategory
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={handleDialogClose}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] h-10 px-4 py-2 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDialogSubmit}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-white hover:bg-slate-900/90 h-10 px-4 py-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {editingCategory ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      {editingCategory ? "Update Category" : "Create Category"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagementPage;

import { useState, useEffect } from "react";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import type { Category } from "../../../types/category";
import { getCategories } from "../../../store/slices/categorySlice";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

const CategoryManagementPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: categories,
    loaded,
    loading,
  } = useSelector((state: RootState) => state.categories);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<{
    id: number;
    name: string;
    parentId?: number;
  } | null>(null);

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // ============ API CALLS ============

  const fetchCategories = async () => {
    try {
      await dispatch(getCategories()).unwrap();
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      setError(error.response?.data?.message || "Failed to fetch categories");
    }
  };

  const createCategory = async () => {
    if (!categoryName.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data } = await axiosInstance.post(
        "/categories",
        {
          name: categoryName,
          ...(parentCategoryId !== null && { parentId: parentCategoryId }),
        },
        {
          headers: {
            "x-api-key": import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (data.success) {
        setCategoryName("");
        setParentCategoryId(null);
        setIsDialogOpen(false);
        toast.success(data.message);
        await fetchCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      console.error("Error creating category:", error);
      setError(error.response?.data?.message || "Failed to create category");
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategory = async (
    id: number,
    name: string,
    parentId?: number | null
  ) => {
    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data } = await axiosInstance.put(
        `/categories/${id}`,
        {
          name: categoryName,
          ...(parentId !== null && { parentId }),
        },
        {
          headers: {
            "x-api-key": import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (data.success) {
        setCategoryName("");
        setParentCategoryId(null);
        setEditingCategory(null);
        setIsDialogOpen(false);
        toast.success(data.message);
        await fetchCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      console.error("Error updating category:", error);
      setError(error.response?.data?.message || "Failed to update category");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (id: number, isSubcategory: boolean = false) => {
    const confirmMessage = isSubcategory
      ? "Are you sure you want to delete this subcategory? This action cannot be undone."
      : "Are you sure you want to delete this category and all its subcategories? This action cannot be undone.";

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data } = await axiosInstance.delete(
        `/categories/${id}`,
        {
          headers: {
            "x-api-key": import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      console.error("Error deleting category:", error);
      setError(error.response?.data?.message || "Failed to delete category");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loaded) {
      fetchCategories();
    }
  }, [loaded, dispatch]);

  // ============ HANDLERS ============

  const handleEditCategory = (category: Category, parentId?: number) => {
    setEditingCategory({
      id: category.id,
      name: category.name,
      parentId,
    });
    setCategoryName(category.name);
    if (parentId) {
      setParentCategoryId(parentId);
    }
    setIsDialogOpen(true);
  };

  const handleDeleteCategory = (id: number, isSubcategory: boolean = false) => {
    deleteCategory(id, isSubcategory);
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
      updateCategory(editingCategory.id, categoryName, parentCategoryId);
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
        {loading ? (
          <div className="flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-[hsl(var(--muted-foreground))]">
            <p>No categories found. Create your first category.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id}>
                <div>
                  <div className="flex items-center justify-between p-3 hover:bg-[hsl(var(--muted))] rounded-lg transition-colors">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="flex items-center gap-2 flex-1 text-left cursor-pointer"
                    >
                      {expandedCategories.includes(category.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <span className="font-semibold">{category.name}</span>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-300/80 text-black">
                        {category._count.products} products
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
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--destructive))] hover:text-[hsl(var(--destructive-foreground))] h-9 px-3 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subcategories */}
                  {expandedCategories.includes(category.id) && (
                    <div className="ml-8 space-y-1 mt-2">
                      {category.children.length > 0 ? (
                        category.children.map((child) => (
                          <div
                            key={child.id}
                            className="flex items-center justify-between p-2 hover:bg-[hsl(var(--muted))] rounded-lg transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {child.name}
                              </span>
                              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-black text-white">
                                {category._count.products} products
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleEditCategory(child, category.id)
                                }
                                disabled={isLoading}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] h-8 px-2 cursor-pointer"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteCategory(child.id, true)
                                }
                                disabled={isLoading}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[hsl(var(--destructive))] hover:text-[hsl(var(--destructive-foreground))] h-8 px-2 cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm flex items-center justify-center">
                          No children found
                        </div>
                      )}
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
                    {categories.map((parent) => (
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

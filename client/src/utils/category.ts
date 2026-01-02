import type { Category } from "../types/category";

type CategoryNamesResult = {
  parentName: string;
  childName: string;
} | null;

export const getCategoryNamesByIds = (
  categories: Category[],
  parentId: number,
  childId: number
): CategoryNamesResult => {
  const parent = categories.find((c) => c.id === parentId);
  if (!parent || !parent.children) return null;

  const child = parent.children.find((c) => c.id === childId);
  if (!child) return null;

  return {
    parentName: parent.name.toLowerCase(),
    childName: child.name.toLowerCase(),
  };
};

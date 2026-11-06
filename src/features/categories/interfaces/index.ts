export interface Category {
  id: string;
  name: string;
  color: string;
  usageCount: number;
}

export interface CategoryList {
  items: Category[];
  total: number;
}

export const CATEGORY_PATHS = {
  list: "/categories",
  getOrCreate: "/categories/get-or-create",
  detail: (id: string) => `/categories/${id}`,
} as const;

export interface UpdateCategoryInput {
  id: string;
  name: string;
}

export const CATEGORY_LIST_LIMIT = 100;

export interface Category {
  id: number;
  name: string;
  slug?: string;
  children: Category[];
  _count: {
    products: number;
  };
}

import { categories } from "../database/seeds/seed.ts";

export const categoryService = {
  tree() {
    return categories.map((category) => ({
      ...category,
      children: categories.filter((item) => item.parentId === category.id)
    }));
  }
};

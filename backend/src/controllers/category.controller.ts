import { categoryService } from "../services/category.service.ts";

export const categoryController = {
  tree() {
    return categoryService.tree();
  }
};

import { CATEGORIES, Category, CategoryID } from "../ts";

export const categoryById = (id: CategoryID): Category | undefined =>
  CATEGORIES.find((category) => category.id === id) as Category | undefined;

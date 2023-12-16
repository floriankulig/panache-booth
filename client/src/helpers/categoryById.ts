import { CATEGORIES, Category, CategoryID } from "../models";

export const categoryById = (id: CategoryID): Category | undefined =>
  CATEGORIES.find((category) => category.id === id) as Category | undefined;

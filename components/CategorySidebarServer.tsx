import {
  getAllCategoriesWithCounts,
  getCategoriesWithCounts,
} from "@/data/catalog";
import { CategorySidebar } from "@/components/CategorySidebar";

export function CategorySidebarServer() {
  return (
    <CategorySidebar
      categories={getCategoriesWithCounts()}
      allCategories={getAllCategoriesWithCounts()}
    />
  );
}

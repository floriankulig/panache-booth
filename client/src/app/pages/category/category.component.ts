import { Component, OnDestroy, computed, effect, signal } from "@angular/core";
import { CATEGORIES, Category } from "../../../models";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { AuthService, FilterService, ProductService } from "../../services";
import { ProductCardComponent } from "../../components/product";
import { filterByString } from "../../../helpers";
import { IconsModule } from "../../icons/icons.module";

@Component({
  selector: "pb-category",
  standalone: true,
  imports: [RouterModule, ProductCardComponent, IconsModule],
  templateUrl: "./category.component.html",
  styleUrl: "./category.component.scss",
})
export class CategoryComponent implements OnDestroy {
  selectedCategory = signal<Category | null>(null);
  productsVisible = computed(() =>
    this.productService
      .products()
      .filter(
        (product) =>
          product.isVisible ||
          product.vendor.id === this.authService.user()?.id,
      ),
  );
  productsByCategory = computed(() =>
    filterByString(
      this.productsVisible()
        .filter((product) => product.category === this.selectedCategory()?.id)
        .map((product) => ({
          ...product,
          vendorName: product.vendor.userName,
        })),
      this.filterService.searchFilter(),
      {
        include: ["name", "vendorName", "category", "description", "price"],
      },
    ),
  );

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private authService: AuthService,
    private filterService: FilterService,
  ) {
    this.route.queryParams.subscribe((params) => {
      const categoryId = params["category"];
      this.selectedCategory.set(
        CATEGORIES.find((cat) => categoryId === cat.id) || null,
      );
    });

    effect(() => {
      if (this.selectedCategory()) {
        this.filterService.searchbarPlaceholder = `Search ${
          this.selectedCategory()?.displayValue
        }`;
      } else {
        this.filterService.searchbarPlaceholder = "Search categories";
      }
    });
  }

  ngOnDestroy() {
    this.filterService.resetSearchbarPlaceholder();
  }

  get categories(): Category[] {
    return filterByString([...CATEGORIES], this.filterService.searchFilter());
  }

  navigateTo(url: string) {
    this.router.navigateByUrl(url);
  }

  itemAmountPerCategory(category: Category) {
    return this.productsVisible().filter(
      (product) => product.category === category.id,
    ).length;
  }
}

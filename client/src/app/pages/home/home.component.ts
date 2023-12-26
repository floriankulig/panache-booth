import { Component, computed, signal } from "@angular/core";
import { ProductCardComponent } from "../../components/product";
import { AuthService, ProductService } from "../../services";
import { ActivatedRoute } from "@angular/router";
import { filterByString } from "../../../helpers";
import { Product } from "../../../models";

@Component({
  selector: "pb-home",
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
})
export class HomeComponent {
  searchFilter = signal("");

  shownProducts = computed(
    () =>
      filterByString(
        this.productService
          .products()
          .filter(
            (product) =>
              product.isVisible ||
              product.vendor.id === this.authService.user()?.id,
          )
          .map((product) => ({
            ...product,
            vendorName: product.vendor.userName,
          })),
        this.searchFilter(),
        {
          include: ["name", "vendorName", "category", "description", "price"],
        },
      ).map((prod) => {
        const { vendorName, ...product } = prod;
        return product;
      }) as Product[],
  );

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthService,
  ) {
    this.route.queryParams.subscribe((params) => {
      const search = params["q"];
      this.searchFilter.set(search || "");
    });
  }

  updateList() {
    this.productService.getProducts();
  }
}

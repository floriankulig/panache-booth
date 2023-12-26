import { Component, computed, signal } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { Product } from "../../../models";
import {
  AuthService,
  CartService,
  NotificationService,
  ProductService,
} from "../../services";
import { AxiosError } from "axios";
import { QuantityComponent } from "../../components/product/quantity/quantity.component";
import { IconsModule } from "../../icons/icons.module";
import { categoryById, filterByString } from "../../../helpers";
import { ProductCardComponent } from "../../components/product";
import { format } from "date-fns";

@Component({
  selector: "pb-product",
  standalone: true,
  imports: [QuantityComponent, IconsModule, RouterModule, ProductCardComponent],
  templateUrl: "./product.component.html",
  styleUrl: "./product.component.scss",
})
export class ProductComponent {
  product?: Product;
  addToCartQuantity = 1;
  searchFilter = signal("");
  productId = signal("");
  isOwnProduct = computed(
    () =>
      this.product?.vendor.id === this.authService.user()?.id &&
      !!this.productId(),
  );

  moreProducts = computed(() =>
    filterByString(
      this.productService
        .products()
        .filter(
          (product) =>
            product.vendor.id === this.product?.vendor.id &&
            (product.isVisible || this.isOwnProduct()) &&
            product.id !== this.productId(),
        ),
      this.searchFilter(),
      {
        include: ["name", "category", "description", "price"],
      },
    ),
  );

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {
    this.route.queryParams.subscribe((params) => {
      const search = params["q"];
      this.searchFilter.set(search || "");
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");

      if (!id) {
        this.productId.set("");
        return;
      }

      this.productId.set(id);
      this.loadProduct(id);
    });
  }

  private async loadProduct(id: string) {
    try {
      const product = await this.productService.getProduct(id);
      this.product = product;
    } catch (error) {
      if (
        !((error as AxiosError).response?.data as string).includes(
          "Product is not existing!", //Was eine scheiß Fehlermeldung
        )
      ) {
        this.notificationService.addNotification({
          message: "Something went wrong.",
          icon: "error",
          duration: 5000,
        });
      }
    }
  }

  get maxProductQuantity() {
    if (!this.product) {
      return 0;
    }
    return this.product?.inventory - this.quantityInCart;
  }

  get lastUpdated() {
    if (!this.product) {
      return "";
    }
    return format(new Date(this.product.updatedAt), "dd.MM.yyyy");
  }

  get quantityInCart() {
    if (!this.product) {
      return 0;
    }
    return this.cartService.getItemQuantity(this.product);
  }

  get productCategory() {
    return categoryById(this.product!.category)?.displayValue;
  }

  get vendorLink() {
    return `/profile?id=${this.product?.vendor.id}`;
  }

  addToCart() {
    if (!this.product) {
      return;
    }

    this.cartService.addToCart(this.product, this.addToCartQuantity);
    this.addToCartQuantity = 1;
  }

  navigateTo(url: string) {
    this.router.navigateByUrl(url);
  }

  async toggleVisibility(): Promise<void> {
    if (!this.product) {
      return;
    }
    try {
      await this.productService.updateProduct({
        ...this.product,
        isVisible: !this.product.isVisible,
      });
      this.notificationService.addNotification({
        type: "success",
        message: this.product.isVisible
          ? `${this.product.name} is now hidden`
          : `${this.product.name} is now visible`,
        duration: 1000,
      });
      this.loadProduct(this.product.id);
    } catch (error) {
      this.notificationService.addNotification({
        type: "error",
        message: `Couldn't update "${this.product.name}".`,
        duration: 2000,
      });
    }
  }
}

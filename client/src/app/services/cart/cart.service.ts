import {
  WritableSignal,
  Injectable,
  signal,
  Signal,
  computed,
  effect,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { filter, map } from "rxjs";
import { Product } from "../../../models";
import { ProductService } from "../product/product.service";
import { NotificationService } from "../notification/notification.service";

export interface CartItem {
  id: string;
  quantity: number;
}

@Injectable({
  providedIn: "root",
})
export class CartService {
  cartOpen = signal(false);
  private cartItems: WritableSignal<CartItem[]> = signal([]);
  cartProducts: Signal<Product[]> = computed(() =>
    this.productService
      .products()
      .filter(
        (product) =>
          product.isVisible &&
          !!this.cartItems().find((item) => item.id === product.id),
      ),
  );

  private _urlStateName = "cart";
  private _urlStateTruthy = "open";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private notificationService: NotificationService,
  ) {
    this.route.queryParams
      .pipe(
        filter((params) => this._urlStateName in params),
        map((params) => params[this._urlStateName] === this._urlStateTruthy),
      )
      .subscribe((isOpen) => this.cartOpen.set(isOpen));

    this.cartItems.set(JSON.parse(localStorage.getItem("cartItems") || "[]"));

    effect(() => {
      // Save cartItems to localStorage
      if (this.cartItems().length === 0) {
        localStorage.removeItem("cartItems");
        return;
      }
      localStorage.setItem("cartItems", JSON.stringify(this.cartItems()));
    });
  }

  toggleCart() {
    const newValue = !this.cartOpen();
    this.updateCartOpen(newValue);
  }

  setCartOpen(isOpen: boolean) {
    this.updateCartOpen(isOpen);
  }

  private updateCartOpen(newValue: boolean) {
    this.cartOpen.set(newValue);
    this.router.navigate([], {
      queryParams: {
        [this._urlStateName]: newValue ? this._urlStateTruthy : undefined,
      },
      queryParamsHandling: "merge",
      replaceUrl: true,
    });
  }

  addToCart(product: Product, quantity = 1) {
    if (quantity < 1) {
      return;
    }
    const existingItem = this.cartItems().find(
      (item) => item.id === product.id,
    );
    if (existingItem) {
      existingItem.quantity += quantity;
      this.cartItems.update((prev) => [
        ...prev.filter((item) => item.id !== existingItem.id),
        existingItem,
      ]);
    } else {
      this.cartItems.update((prev) => [...prev, { id: product.id, quantity }]);
    }
    this.notificationService.addNotification({
      message: `${product.name} added to cart`,
      duration: 1500,
    });
  }
}

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
import { CartProduct, Product } from "../../../models";
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
  cartProducts: Signal<CartProduct[]> = computed(() =>
    this.productService
      .products()
      .map((product) => {
        let quantity =
          this.cartItems().find((item) => item.id === product.id)?.quantity ||
          -1;
        quantity = Math.min(quantity, product.inventory || Infinity);
        return {
          ...product,
          quantity,
        };
      })
      .filter((product) => product.isVisible && product.quantity > 0),
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

  setItemQuantity(item: CartProduct, quantity: number) {
    if (quantity < 1) {
      return;
    }
    this.cartItems.update((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.quantity = quantity;
        return [...prev.filter((i) => i.id !== existingItem.id), existingItem];
      } else {
        return [...prev, { id: item.id, quantity }];
      }
    });
  }

  getItemQuantity(item: CartProduct | Product) {
    return this.cartItems().find((i) => i.id === item.id)?.quantity || 0;
  }

  removeItem(item: CartProduct) {
    this.cartItems.update((prev) => prev.filter((i) => i.id !== item.id));
    this.notificationService.addNotification({
      icon: "trash",
      type: "error",
      message: `${item.name} removed from cart`,
      duration: 1500,
    });
  }

  clearCart() {
    this.cartItems.set([]);
  }
}

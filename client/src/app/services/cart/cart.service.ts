import { WritableSignal, Injectable, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { filter, map } from "rxjs";

export interface CartItem {
  id: string;
  quantity: number;
}

@Injectable({
  providedIn: "root",
})
export class CartService {
  cartOpen = signal(false);
  cartItems: WritableSignal<CartItem[]> = signal([]);

  private _urlStateName = "cart";
  private _urlStateTruthy = "open";

  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.queryParams
      .pipe(
        filter((params) => this._urlStateName in params),
        map((params) => params[this._urlStateName] === this._urlStateTruthy),
      )
      .subscribe((isOpen) => this.cartOpen.set(isOpen));
  }

  toggleCart() {
    const newValue = !this.cartOpen();
    this.updateCartOpen(newValue);
  }

  setCart(isOpen: boolean) {
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
}

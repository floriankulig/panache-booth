import { WritableSignal, Injectable, signal } from "@angular/core";

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

  constructor() {}
}

import { Component, Signal, computed, effect } from "@angular/core";
import {
  AuthService,
  CartService,
  NotificationService,
  OrderService,
} from "../../services";
import { CartProduct, User } from "../../../models";
import { IconsModule } from "../../icons/icons.module";
import { getDiscountedPrice } from "../../../helpers";
import { QuantityComponent } from "../product/quantity/quantity.component";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "pb-cart",
  standalone: true,
  imports: [IconsModule, QuantityComponent],
  templateUrl: "./cart.component.html",
  styleUrl: "./cart.component.scss",
})
export class CartComponent {
  cartProducts = computed(() => this.cartService.cartProducts());
  submitting = false;
  showPayments = false;
  vendors: Signal<User[]> = computed(() => {
    const uniqueVendors: User[] = [];
    this.cartProducts().forEach((product) => {
      if (!uniqueVendors.find((vendor) => vendor.id === product.vendor.id)) {
        uniqueVendors.push(product.vendor);
      }
    });
    return uniqueVendors.sort((a, b) => a.userName.localeCompare(b.userName));
  });
  itemsByVendor = computed(() => {
    return this.vendors().map((vendor) => {
      const vendorItems = this.cartService
        .cartProducts()
        .filter((product) => product.vendor.id === vendor.id);
      return {
        vendor,
        total: this.costOfCartProducts(vendorItems),
        items: vendorItems,
      };
    });
  });

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private notificiationService: NotificationService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    effect(() => {
      console.log(this.vendors());
      console.log(this.itemsByVendor());
    });
  }

  private costOfCartProducts(
    products: CartProduct[],
    discounted = true,
  ): number {
    return products.reduce((total, product) => {
      const productPrice = discounted
        ? getDiscountedPrice(product)
        : product.price;
      return total + productPrice * product.quantity;
    }, 0);
  }

  get uniqueItems() {
    return this.cartProducts().length;
  }

  get itemsTotal() {
    return this.costOfCartProducts(this.cartProducts());
  }

  get itemsCount() {
    return this.cartService
      .cartProducts()
      .reduce((total, product) => total + product.quantity, 0);
  }

  get shippingTotal() {
    return this.itemsByVendor().reduce((shippingtotal, { vendor, items }) => {
      const costPerVendor = this.costOfCartProducts(items);
      if (
        costPerVendor > Number(vendor.shippingFreeFrom) &&
        this.vendorHasFreeShipping(vendor)
      ) {
        return shippingtotal;
      } else {
        return shippingtotal + Number(vendor.shippingCost);
      }
    }, 0);
  }

  get cartTotal(): number {
    return this.itemsTotal + this.shippingTotal;
  }

  onClearCart() {
    this.cartService.clearCart();
    this.cartService.setCartOpen(false);
  }

  onRemoveItem(product: CartProduct) {
    this.cartService.removeItem(product);
  }

  onQuantityChange(product: CartProduct, quantity: number) {
    this.cartService.setItemQuantity(product, quantity);
  }

  floor(num: number) {
    return Math.round(num);
  }
  discounted(product: CartProduct) {
    return getDiscountedPrice(product);
  }

  vendorHasFreeShipping(vendor: User) {
    return vendor.shippingFreeFrom >= 0;
  }

  get cartProductsDiscountedLast() {
    return this.cartProducts().sort((a, b) => {
      return a.discount - b.discount;
    });
  }

  get buttonPrimaryText() {
    return this.authService.user() ? "Checkout" : "Login to Checkout";
  }

  async onCheckout() {
    if (this.submitting || this.cartProducts().length <= 0) {
      return;
    }
    const hasUser = await this.authService.isLoggedIn();
    if (!hasUser) {
      console.log(this.router.url);
      this.router.navigate(["/login"], {
        queryParams: { redirect: `${this.router.url}` },
      });
      return;
    }
    this.submitting = true;
    try {
      await this.orderService.createOrder({
        userId: this.authService.user()!.id,
        price: this.cartTotal,
        products: this.cartProducts(),
      });
      this.showPayments = true;
    } catch (error) {}
    this.submitting = false;
  }
}

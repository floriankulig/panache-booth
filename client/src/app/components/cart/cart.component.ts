import { Component, OnDestroy, Signal, computed } from "@angular/core";
import {
  AuthService,
  CartService,
  NotificationService,
  OrderService,
} from "../../services";
import { CartProduct, User } from "../../../models";
import { IconsModule } from "../../icons/icons.module";
import { costOfCartProducts, getDiscountedPrice } from "../../../helpers";
import { QuantityComponent } from "../product/quantity/quantity.component";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "pb-cart",
  standalone: true,
  imports: [IconsModule, QuantityComponent],
  templateUrl: "./cart.component.html",
  styleUrl: "./cart.component.scss",
})
export class CartComponent implements OnDestroy {
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
      const itemTotal = costOfCartProducts(vendorItems);
      return {
        vendor,
        total: itemTotal,
        totalWithShipping:
          (vendor.shippingCost || 0) > 0 &&
          this.vendorHasFreeShipping(vendor) &&
          itemTotal > vendor.shippingFreeFrom
            ? itemTotal
            : itemTotal + Number(vendor.shippingCost),
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
  ) {}

  ngOnDestroy() {
    if (this.showPayments) this.cartService.clearCart();
  }

  get uniqueItems() {
    return this.cartProducts().length;
  }

  get itemsTotal() {
    return costOfCartProducts(this.cartProducts());
  }

  get itemsCount() {
    return this.cartService
      .cartProducts()
      .reduce((total, product) => total + product.quantity, 0);
  }

  get shippingTotal() {
    return this.itemsByVendor().reduce((shippingtotal, { vendor, items }) => {
      const costPerVendor = costOfCartProducts(items);
      if (
        costPerVendor >= Number(vendor.shippingFreeFrom) &&
        this.vendorHasFreeShipping(vendor)
      ) {
        return shippingtotal;
      } else {
        return shippingtotal + Number(vendor.shippingCost);
      }
    }, 0);
  }

  get cartTotal(): number {
    return +(this.itemsTotal + this.shippingTotal).toFixed(2);
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
      this.notificiationService.addNotification({
        message: "Order placed successfully",
        type: "success",
        duration: 5000,
      });
    } catch (error) {
      this.notificiationService.addNotification({
        message: "Order could not be placed",
        type: "error",
        duration: 5000,
      });
    } finally {
      this.submitting = false;
    }
  }
}

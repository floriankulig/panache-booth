import { Component, Signal, computed, effect } from "@angular/core";
import { CartService } from "../../services";
import { CartProduct, User } from "../../../models";
import { IconsModule } from "../../icons/icons.module";
import { getDiscountedPrice } from "../../../helpers";

@Component({
  selector: "pb-cart",
  standalone: true,
  imports: [IconsModule],
  templateUrl: "./cart.component.html",
  styleUrl: "./cart.component.scss",
})
export class CartComponent {
  cartProducts = computed(() => this.cartService.cartProducts());
  vendors: Signal<User[]> = computed(() => {
    const uniqueVendors: User[] = [];
    this.cartProducts().forEach((product) => {
      if (!uniqueVendors.find((vendor) => vendor.id === product.vendor.id)) {
        uniqueVendors.push(product.vendor);
      }
    });
    return uniqueVendors;
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

  constructor(private cartService: CartService) {
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
      if (costPerVendor > Number(vendor.shippingFreeFrom)) {
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
  }
  floor(num: number) {
    return Math.floor(num);
  }
  discounted(product: CartProduct) {
    return getDiscountedPrice(product);
  }

  get cartProductsDiscountedLast() {
    return this.cartProducts().sort((a, b) => {
      return a.discount - b.discount;
    });
  }
}

import { Component, Input, computed, effect, signal } from "@angular/core";
import { AuthService, NotificationService, OrderService } from "../../services";
import { Order, OrderProduct, User } from "../../../models";
import { AxiosError } from "axios";
import { Router } from "@angular/router";
import { IconsModule } from "../../icons/icons.module";
import { format, isSameDay, isToday, subDays } from "date-fns";
import { costOfCartProducts, getDiscountedPrice } from "../../../helpers";

type DisplayType = "vendor" | "customer";

@Component({
  selector: "pb-orders",
  standalone: true,
  imports: [IconsModule],
  templateUrl: "./orders.component.html",
  styleUrl: "./orders.component.scss",
})
export class OrdersComponent {
  @Input() inModal: boolean = false;
  userIsVendor = computed(() => this.authService.user()?.isVendor);
  displayType = signal<DisplayType>(
    this.inModal || !this.authService.user()?.isVendor ? "customer" : "vendor",
  );
  orders = signal<Order[]>([]);
  errorMessage = "";
  loading = true;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
  ) {
    effect(() => {
      this.getOrders(this.displayType(), this.authService.user()?.id);
    });
    effect(() => {
      if (!this.authService.user()) {
        this.router.navigate(["/"]);
      }
    });
    // effect(
    //   () => {
    //     this.displayType.set(this.userIsVendor() ? "vendor" : "customer");
    //   },
    //   { allowSignalWrites: true },
    // );
  }

  private async getOrders(displayType: DisplayType, userId?: string) {
    if (!userId) {
      this.errorMessage = "Must be logged in to view orders!";
      return;
    }
    this.errorMessage = "";
    this.loading = true;
    try {
      let newOrders: Order[] = [];
      if (displayType === "customer") {
        newOrders = await this.orderService.getCustomerOrders(userId);
      } else {
        newOrders = await this.orderService.getVendorOrders(userId);
      }
      newOrders = newOrders.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
      this.orders.set(newOrders);
    } catch (error) {
      this.errorMessage = (error as AxiosError).message;
    } finally {
      this.loading = false;
      console.log(this.orders());
    }
  }

  formatDate(dateString: string) {
    const date = new Date(dateString);
    return (
      (isToday(date)
        ? "Today"
        : isSameDay(date, subDays(new Date(), 1))
        ? "Yesterday"
        : format(date, "do MMMM yyyy")) +
      " at " +
      format(date, "HH:mm")
    );
  }

  viewProduct(product: OrderProduct) {
    if (!product.archived) {
      this.router.navigate(["/product", product.id]);
    } else {
      this.notificationService.addNotification({
        type: "warning",
        message: product.name + " does not exist anymore.",
        duration: 5000,
      });
    }
  }

  async markOrderAsDelivered(order: Order) {
    try {
      await this.orderService.updateOrder({
        id: order.id,
        products: order.products.map((product) => ({
          id: product.id,
          delivered: true,
        })),
      });
      this.getOrders(this.displayType(), this.authService.user()?.id);
    } catch (error) {
      this.notificationService.addNotification({
        type: "error",
        message: "Order could not be updated.",
        duration: 5000,
      });
    }
  }

  productsByVendors(products: OrderProduct[]) {
    const uniqueVendors: User[] = [];
    products.forEach((product) => {
      if (!uniqueVendors.find((vendor) => vendor.id === product.vendor.id)) {
        uniqueVendors.push(product.vendor);
      }
    });
    uniqueVendors.sort((a, b) => a.userName.localeCompare(b.userName));

    return uniqueVendors.map((vendor) => {
      const vendorItems = products.filter(
        (product) => product.vendor.id === vendor.id,
      );
      const itemTotal = costOfCartProducts(vendorItems);
      return {
        vendor,
        total: itemTotal,
        totalWithShipping:
          (vendor.shippingCost || 0) > 0 &&
          vendor.shippingFreeFrom >= 0 &&
          itemTotal > vendor.shippingFreeFrom
            ? itemTotal
            : itemTotal + Number(vendor.shippingCost),
        products: vendorItems,
      };
    });
  }

  allDelivered(order: Order | OrderProduct[]) {
    if (Array.isArray(order)) {
      return order.every((product) => product.delivered);
    }
    return order.products.every((product) => product.delivered);
  }

  productPrice(product: OrderProduct) {
    return (getDiscountedPrice(product) * product.quantity).toFixed(2);
  }
}

import { signal, Injectable, effect } from "@angular/core";
import { API_URL, CartOrder, Order, OrderProduct } from "../../../models";
import axios, { AxiosError } from "axios";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  ordersOpen = signal(false);
  private _displayOrdersNotification = false;

  constructor(private authService: AuthService) {
    effect(() => {
      console.log(this.lastTimeOrdersOpen);
      if (this.ordersOpen()) {
        localStorage.setItem(
          "lastTimeOrdersOpen",
          JSON.stringify(new Date().toISOString()),
        );
        this._displayOrdersNotification = false;
      }
    });
    effect(() => {
      if (this.authService.user() === null) {
        return;
      }
      (async () => {
        try {
          const orders = await this.getCustomerOrders(
            this.authService.user()!.id,
          );
          this._displayOrdersNotification = orders.some((order) => {
            const orderDate = new Date(order.updatedAt);
            return orderDate.getTime() > this.lastTimeOrdersOpen.getTime();
          });
        } catch (error) {
          console.error(error);
        }
      })();
    });
  }

  private get lastTimeOrdersOpen() {
    return new Date(
      JSON.parse(localStorage.getItem("lastTimeOrdersOpen") || "undefined"),
    );
  }

  get displayOrdersNotification(): boolean {
    return this._displayOrdersNotification;
  }

  async createOrder(order: CartOrder) {
    try {
      const res = await axios.post<CartOrder>(`${API_URL}/order`, {
        ...order,
      });
      return res.data;
    } catch (error) {
      throw error as AxiosError;
    }
  }

  async getCustomerOrders(userId: string) {
    try {
      const res = await axios.get<Order[]>(
        `${API_URL}/order/${userId}?isVendor=false`,
      );
      return res.data;
    } catch (error) {
      throw error as AxiosError;
    }
  }
  async getVendorOrders(userId: string) {
    try {
      const res = await axios.get<Order[]>(
        `${API_URL}/order/${userId}?isVendor=true`,
      );
      return res.data;
    } catch (error) {
      throw error as AxiosError;
    }
  }

  async updateOrder(order: {
    id: string;
    products: Pick<OrderProduct, "id" | "delivered">[];
  }) {
    try {
      const res = await axios.put<Order>(`${API_URL}/order/${order.id}`, {
        products: order.products,
      });
      return res.data;
    } catch (error) {
      throw error as AxiosError;
    }
  }
}

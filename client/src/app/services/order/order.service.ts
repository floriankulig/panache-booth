import { signal, Injectable, effect } from "@angular/core";
import { API_URL, CartOrder, Order, OrderProduct } from "../../../models";
import axios, { AxiosError } from "axios";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  ordersOpen = signal(false);

  constructor() {
    effect(() => {
      axios.get(`${API_URL}/order`).then((res) => {
        console.log(res.data);
      });
    });
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

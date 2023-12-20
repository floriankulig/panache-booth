import { signal, Injectable, effect } from "@angular/core";
import { API_URL, CartOrder } from "../../../models";
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
}

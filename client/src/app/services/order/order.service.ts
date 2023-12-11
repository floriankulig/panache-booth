import { signal, Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  ordersOpen = signal(false);

  constructor() {}
}

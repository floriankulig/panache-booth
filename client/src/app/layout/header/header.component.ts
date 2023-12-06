import {
  computed,
  Output,
  EventEmitter,
  signal,
  Component,
} from "@angular/core";
import { SearchbarComponent } from "./searchbar/searchbar.component";
import { IconsModule } from "../../icons/icons.module";
import { ProfileMenuComponent } from "./profile-menu/profile-menu.component";
import {
  CartService,
  NotificationService,
  Notification,
  OrderService,
} from "../../services";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [SearchbarComponent, IconsModule, ProfileMenuComponent],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent {
  productsInCart = computed(() => this.cartService.cartItems().length);

  @Output() openSidebar = new EventEmitter();

  constructor(
    private cartService: CartService,
    private orderService: OrderService,

    private notificationService: NotificationService,
  ) {}

  openCart() {
    this.cartService.cartOpen.set(true);
  }
  openOrders() {
    this.orderService.ordersOpen.set(true);
  }

  addNoti() {
    const notis = [
      {
        type: "success",
        message: "This is a success notification!",
        duration: 3000,
      },
      { type: "info", message: "This is a info notification!", duration: 6000 },
      {
        type: "warning",
        message: "This is a warning notification!",
        duration: 9000,
      },
      {
        type: "error",
        message: "This is a error notification!",
        duration: 900,
      },
    ];

    // const randomNoti = notis[Math.floor(Math.random() * notis.length)];
    // this.notificationService.addNotification(randomNoti as Notification);
    notis.forEach((noti) => {
      this.notificationService.addNotification(noti as Notification);
    });
  }

  toggleSidebar() {
    this.openSidebar.emit();
  }
}

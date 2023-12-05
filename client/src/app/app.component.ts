import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LayoutComponent } from "./layout/layout.component";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { isAuthUrl } from "../helpers";
import { AuthComponent } from "./layout/auth/auth.component";
import { NotificationService, CartService, OrderService } from "./services";
import { NotificationComponent } from "./components/notification/notification.component";
import { ModalComponent } from "./components/modal/modal.component";
import { CartComponent } from "./components/cart/cart.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    LayoutComponent,
    RouterOutlet,
    AuthComponent,
    ModalComponent,
    NotificationComponent,
    CartComponent,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  showLayout = true;
  activeNotifications = this.notificationService.notifications;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    public cartService: CartService,
    public orderService: OrderService,
  ) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.showLayout = !isAuthUrl(val.url);
      }
    });
  }

  removeNotification(notificationIndex: number) {
    this.notificationService.removeNotification(notificationIndex);
  }
}

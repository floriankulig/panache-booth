import { Component, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LayoutComponent } from "./layout/layout.component";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { isAuthUrl } from "../helpers";
import { AuthComponent } from "./layout/auth/auth.component";
import {
  NotificationService,
  CartService,
  OrderService,
  AuthService,
} from "./services";
import { NotificationComponent } from "./components/notification/notification.component";
import { ModalComponent } from "./components/modal/modal.component";
import { CartComponent } from "./components/cart/cart.component";
import { OrdersComponent } from "./pages/orders/orders.component";
import { ProfileMenuComponent } from "./layout/header/profile-menu/profile-menu.component";
import { ClickOutsideDirective } from "./directives/click-outside.directive";

@Component({
  selector: "pb-root",
  standalone: true,
  imports: [
    CommonModule,
    LayoutComponent,
    RouterOutlet,
    AuthComponent,
    ModalComponent,
    NotificationComponent,
    OrdersComponent,
    CartComponent,
    ClickOutsideDirective,
    ProfileMenuComponent,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  showLayout = true;
  activeNotifications = this.notificationService.notifications;
  profileMenuOpen = computed(() => this.authService.profileMenuOpen());

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    public cartService: CartService,
    public orderService: OrderService,
    public authService: AuthService,
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

  clickOutsideMenu() {
    if (this.profileMenuOpen()) {
      // this.authService.profileMenuOpen.set(false);
    }
  }
}

import { computed, Output, EventEmitter, Component } from "@angular/core";
import { SearchbarComponent } from "./searchbar/searchbar.component";
import { IconsModule } from "../../icons/icons.module";
import { ProfileMenuComponent } from "./profile-menu/profile-menu.component";
import { CartService, OrderService } from "../../services";
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationEnd,
  Router,
} from "@angular/router";

@Component({
  selector: "pb-header",
  standalone: true,
  imports: [SearchbarComponent, IconsModule, ProfileMenuComponent],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent {
  productsInCart = computed(() => this.cartService.cartItems().length);
  tabText = "Products";

  @Output() openSidebar = new EventEmitter();

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
  ) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.tabText = this.getTabText(val.url);
      }
    });
  }

  private getTabText(url: string) {
    const urlParts = url.split("?")[0].split("/");
    const firstPart = urlParts[1];
    switch (firstPart) {
      case "orders":
        return "Orders";
      case "profile":
        return "Profile";
      default:
        return "Products";
    }
  }

  openCart() {
    this.cartService.setCart(true);
  }
  openOrders() {
    this.orderService.ordersOpen.set(true);
  }

  toggleSidebar() {
    this.openSidebar.emit();
  }
}

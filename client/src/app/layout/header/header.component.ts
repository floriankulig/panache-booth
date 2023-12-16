import { computed, Output, EventEmitter, Component } from "@angular/core";
import { SearchbarComponent } from "./searchbar/searchbar.component";
import { IconsModule } from "../../icons/icons.module";
import { ProfileMenuComponent } from "./profile-menu/profile-menu.component";
import { CartService, OrderService } from "../../services";
import { NavigationEnd, Router } from "@angular/router";
import { SIDEBAR_TABS } from "../../../models";

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
    const activeTabGroup = SIDEBAR_TABS.find((tab) =>
      tab.links.find((link) => link.url === url),
    );
    return (
      activeTabGroup?.links.find((link) => link.url === url)?.name || "Home"
    );
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

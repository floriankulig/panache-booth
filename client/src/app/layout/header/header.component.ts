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
import { CartService, OrderService } from "../../services";

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
  ) {}

  openCart() {
    this.cartService.cartOpen.set(true);
  }
  openOrders() {
    this.orderService.ordersOpen.set(true);
  }

  toggleSidebar() {
    this.openSidebar.emit();
  }
}

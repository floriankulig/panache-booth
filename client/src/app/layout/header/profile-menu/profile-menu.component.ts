import {
  signal,
  Component,
  ElementRef,
  computed,
  OnInit,
  HostBinding,
} from "@angular/core";
import { IconsModule } from "../../../icons/icons.module";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../../services/auth/auth.service";
import { getDistanceToDate } from "../../../../helpers";
import { isToday } from "date-fns";
import { User } from "../../../../models";
import { CartService, OrderService } from "../../../services";
import {
  animate,
  animateChild,
  query,
  style,
  transition,
  trigger,
} from "@angular/animations";

@Component({
  selector: "pb-profile-menu",
  standalone: true,
  imports: [IconsModule, RouterLink],
  templateUrl: "./profile-menu.component.html",
  styleUrl: "./profile-menu.component.scss",
  animations: [
    trigger("menu", [
      transition("* <=> *", [
        query("@menuAnimation", animateChild(), {
          optional: true,
        }),
      ]),
    ]),
    trigger("menuAnimation", [
      transition(":enter", [
        style({
          opacity: 0,
          scale: 0,
        }),
        animate(
          "300ms cubic-bezier(0.645, 0.045, 0.355, 1)",
          style({
            opacity: 1,
            scale: 1,
          }),
        ),
      ]),
      transition(":leave", [
        style({ opacity: 1, scale: 1 }),
        animate(
          "200ms cubic-bezier(0.645, 0.045, 0.355, 1)",
          style({
            opacity: 0,
            scale: 0.5,
          }),
        ),
      ]),
    ]),
  ],
})
export class ProfileMenuComponent implements OnInit {
  open = signal(false);
  user = this.authService.user;
  userJoinDate = computed(() =>
    this.user()
      ? new Date((this.authService.user() as User).createdAt)
      : new Date(),
  );
  userJoin = computed(
    () =>
      `Joined ${
        isToday(this.userJoinDate())
          ? "today"
          : getDistanceToDate(this.userJoinDate())
      }`,
  );

  constructor(
    private elementRef: ElementRef,
    private authService: AuthService,
    private cartService: CartService,
    private orderService: OrderService,
  ) {}

  @HostBinding("@menu") get animation() {
    return true;
  }

  ngOnInit() {
    document.addEventListener("click", (event) => {
      if (
        !this.elementRef.nativeElement.contains(event.target) &&
        this.open()
      ) {
        this.open.set(false);
      }
    });
  }

  openCart() {
    this.cartService.setCartOpen(true);
    this.open.set(false);
  }

  openOrders() {
    this.orderService.ordersOpen.set(true);
    this.open.set(false);
  }

  toggleMenu() {
    this.open.update((open) => !open);
  }

  logout() {
    this.authService.logout();
  }
}

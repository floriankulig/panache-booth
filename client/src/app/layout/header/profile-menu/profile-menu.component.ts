import { signal, Component, ElementRef, computed } from "@angular/core";
import { IconsModule } from "../../../icons/icons.module";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../../services/auth/auth.service";
import { getDistanceToDate } from "../../../../helpers";
import { isToday } from "date-fns";
import { User } from "../../../../ts";

@Component({
  selector: "app-profile-menu",
  standalone: true,
  imports: [IconsModule, RouterLink],
  templateUrl: "./profile-menu.component.html",
  styleUrl: "./profile-menu.component.scss",
})
export class ProfileMenuComponent {
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
  ) {}

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

  toggleMenu() {
    this.open.update((open) => !open);
  }

  logout() {
    this.authService.logout();
  }
}

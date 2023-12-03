import { signal, Component, ElementRef } from "@angular/core";
import { IconsModule } from "../../../icons/icons.module";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { getDistanceToDate } from "../../../../helpers";

@Component({
  selector: "app-profile-menu",
  standalone: true,
  imports: [IconsModule, RouterLink],
  templateUrl: "./profile-menu.component.html",
  styleUrl: "./profile-menu.component.scss",
})
export class ProfileMenuComponent {
  open = signal(false);
  user = this.authService.user();
  userJoinDate =
    this.user && `Joined ${getDistanceToDate(new Date(this.user?.createdAt))}`;

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
}

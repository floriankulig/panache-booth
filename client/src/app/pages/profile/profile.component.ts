import { Component, OnInit, effect, signal } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { AuthService, NotificationService } from "../../services";
import { User } from "../../../ts";
import { AxiosError } from "axios";
import { Location } from "@angular/common";
import { format } from "date-fns";
import { IconsModule } from "../../icons/icons.module";

@Component({
  selector: "pb-profile",
  standalone: true,
  imports: [IconsModule],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.scss",
})
export class ProfileComponent implements OnInit {
  profile: User | null = null;
  joinDate?: string;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(async (params: ParamMap) => {
      const id = params.get("id") || this.authService.uidFromLocalStorage();

      if (id && id !== this.authService.user()?.id) {
        try {
          this.profile = await this.authService.getUser(id);
        } catch (error) {
          if (
            ((error as AxiosError).response?.data as string).includes(
              "User does not exist",
            )
          ) {
            this.notificationService.addNotification({
              message: "Profile does not exist.",
              type: "error",
              duration: 6000,
            });
          }
          this.router.navigate(["/"]);
        }
      } else {
        this.profile = this.authService.user();
      }

      this.joinDate =
        (this.profile &&
          format(new Date(this.profile.createdAt), "dd.MM.yyyy")) ||
        undefined;

      console.log(this.profile);
    });
  }
}

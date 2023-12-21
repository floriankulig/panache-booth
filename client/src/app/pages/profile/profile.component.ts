import {
  Component,
  OnInit,
  WritableSignal,
  computed,
  effect,
  signal,
} from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { AuthService, NotificationService } from "../../services";
import { User } from "../../../models";
import { AxiosError } from "axios";
import { Location } from "@angular/common";
import { format } from "date-fns";
import { IconsModule } from "../../icons/icons.module";
import { ModalComponent } from "../../components/modal/modal.component";
import { DeleteConfirmComponent } from "../../components/delete-confirm/delete-confirm.component";

@Component({
  selector: "pb-profile",
  standalone: true,
  imports: [IconsModule, ModalComponent, DeleteConfirmComponent],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.scss",
})
export class ProfileComponent implements OnInit {
  profile: WritableSignal<User | undefined> = signal(undefined);
  joinDate = computed(() => {
    if (this.profile()?.createdAt) {
      console.log(this.profile()?.createdAt);
      return format(new Date(this.profile()?.createdAt || ""), "dd.MM.yyyy");
    } else {
      return "";
    }
  });
  isOwnProfile = computed(
    () => this.profile()?.id === this.authService.user()?.id,
  );

  deleteModalOpen = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthService,
  ) {
    effect(() => {
      if (
        !!this.profile() &&
        !this.profile()?.isVendor &&
        !this.isOwnProfile()
      ) {
        this.router.navigate(["/"]);
      }
    });
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(async (params: ParamMap) => {
      const id = params.get("id") || this.authService.uidFromLocalStorage();
      const isOwnProfile = id === this.authService.user()?.id;

      if (id && !isOwnProfile) {
        try {
          this.profile?.set(await this.authService.getUser(id));
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
        if (!this.authService.user()) {
          this.router.navigate(["/"]);
        }
        this.profile.set(this.authService.user() || undefined);
      }
    });
  }

  onEdit() {
    this.router.navigate(["update-profile"]);
  }
}

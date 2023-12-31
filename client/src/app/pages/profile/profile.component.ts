import {
  Component,
  OnInit,
  WritableSignal,
  computed,
  effect,
  signal,
} from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import {
  AuthService,
  FilterService,
  NotificationService,
  ProductService,
} from "../../services";
import { User } from "../../../models";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { IconsModule } from "../../icons/icons.module";
import { ModalComponent } from "../../components/modal/modal.component";
import { DeleteConfirmComponent } from "../../components/delete-confirm/delete-confirm.component";
import {
  AddProductComponent,
  ProductCardComponent,
} from "../../components/product";
import { filterByString } from "../../../helpers";

@Component({
  selector: "pb-profile",
  standalone: true,
  imports: [
    IconsModule,
    ModalComponent,
    DeleteConfirmComponent,
    ProductCardComponent,
    AddProductComponent,
  ],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.scss",
})
export class ProfileComponent implements OnInit {
  addProductModalOpen = signal(false);
  profile: WritableSignal<User | undefined> = signal(undefined);
  joinDate = computed(() => {
    if (this.profile()?.createdAt) {
      return format(new Date(this.profile()?.createdAt || ""), "dd.MM.yyyy");
    } else {
      return "";
    }
  });
  isOwnProfile = computed(
    () => this.profile()?.id === this.authService.user()?.id,
  );

  shownProducts = computed(() =>
    filterByString(
      this.productService
        .products()
        .filter(
          (product) =>
            product.vendorId === this.profile()?.id &&
            (this.isOwnProfile() || product.isVisible),
        )
        .map((product) => ({
          ...product,
          vendorName: product.vendor.userName,
        })),
      this.filterService.searchFilter(),
      {
        include: ["name", "vendorName", "category", "description", "price"],
      },
    ),
  );

  deleteModalOpen = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthService,
    private filterService: FilterService,
    private productService: ProductService,
  ) {
    effect(() => {
      if (
        (!!this.profile() &&
          !this.profile()?.isVendor &&
          !this.isOwnProfile()) ||
        this.profile()?.archived
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
            ) ||
            (error as AxiosError).code === "401"
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

  updateList() {
    this.productService.getProducts();
  }

  openAddProductModal() {
    this.addProductModalOpen.set(true);
  }

  onProductCreated() {
    this.addProductModalOpen.set(false);
    this.updateList();
  }

  onUserDelete() {
    this.deleteModalOpen.set(false);
    this.router.navigate(["/"]);
  }
}

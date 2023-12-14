import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Product, User } from "../../../ts";
import { IconsModule } from "../../icons/icons.module";
import { AuthService, NotificationService } from "../../services";

@Component({
  selector: "pb-delete-confirm",
  standalone: true,
  imports: [IconsModule],
  templateUrl: "./delete-confirm.component.html",
  styleUrl: "./delete-confirm.component.scss",
})
export class DeleteConfirmComponent implements OnInit {
  @Input() user?: User;
  @Input() product?: Product;
  @Output() delete = new EventEmitter();

  submitting = false;

  data?: {
    name: string;
    id: string;
    type?: "user" | "product";
  };

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.data = {
      name: this.user?.userName || "",
      id: this.user?.id || "",
      type: !!this.user ? "user" : !!this.product ? "product" : undefined,
    };
  }

  async onConfirm() {
    try {
      this.submitting = true;
      if (this.data?.type === "user") {
        await this.authService.deleteUser(this.data?.id);
        this.notificationService.addNotification({
          message: "User was deleted deleted.",
          duration: 5000,
          type: "success",
          icon: "user-x",
        });
      } else {
        // TODO: delete product
      }
      this.delete.emit();
    } catch (error) {
      this.notificationService.addNotification({
        message: "User couldn't be deleted. Please try again later.",
        duration: 6000,
        type: "error",
      });
    }
    this.submitting = false;
  }

  get confirmationText() {
    if (!this.data) return "";
    if (this.data.type === "user") {
      return "You are about to permanently delete your account. This action cannot be undone. \n You will no longer be able to log in to your account or access any of your data. Your account will no longer be visible to other users. \n Are you sure you want to continue?";
    } else {
      return "";
    }
  }
}

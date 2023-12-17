import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Product, User } from "../../../models";
import { IconsModule } from "../../icons/icons.module";
import {
  AuthService,
  NotificationService,
  ProductService,
} from "../../services";

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
    private productService: ProductService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.data = {
      name: this.user?.userName || this.product?.name || "",
      id: this.user?.id || this.product?.id || "",
      type: !!this.user ? "user" : !!this.product ? "product" : undefined,
    };
  }

  async onConfirm() {
    try {
      this.submitting = true;
      if (this.data?.type === "user") {
        await this.authService.deleteUser(this.data?.id);
      } else if (this.data?.type === "product") {
        await this.productService.deleteProduct(this.data?.id);
      }
      this.notificationService.addNotification({
        message: `${this.data?.name} was deleted.`,
        duration: 5000,
        type: "error",
        icon: this.data?.type === "user" ? "user-x" : "trash-2",
      });
      this.delete.emit();
    } catch (error) {
      this.notificationService.addNotification({
        message: `${
          this.data?.type === "user" ? "User" : "Product"
        } couldn't be deleted. Please try again later.`,
        duration: 6000,
        type: "error",
      });
    }
    this.submitting = false;
  }

  get confirmationText() {
    if (!this.data) return "";
    switch (this.data.type) {
      case "user":
        return "You are about to permanently delete your account. This action cannot be undone. \n You will no longer be able to log in to your account or access any of your data. Your account will no longer be visible to other users. \n Are you sure you want to continue?";
      case "product":
        return `You are about to permanently delete "${this.data.name}". This action cannot be undone. \n Customers will no longer be shown this product. \n Are you sure you want to continue?`;
      default:
        return "";
    }
  }
}

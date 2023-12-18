import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  computed,
  effect,
  signal,
} from "@angular/core";
import { Product } from "../../../../models";
import { IconsModule } from "../../../icons/icons.module";
import {
  AuthService,
  NotificationService,
  ProductService,
} from "../../../services";
import { ClickOutsideDirective } from "../../../directives/click-outside.directive";
import { ModalComponent } from "../../modal/modal.component";
import { DeleteConfirmComponent } from "../../delete-confirm/delete-confirm.component";
import { AddProductComponent } from "../add-product/add-product.component";

@Component({
  selector: "pb-product-card",
  standalone: true,
  imports: [
    IconsModule,
    ClickOutsideDirective,
    ModalComponent,
    DeleteConfirmComponent,
    AddProductComponent,
  ],
  templateUrl: "./product-card.component.html",
  styleUrl: "./product-card.component.scss",
})
export class ProductCardComponent {
  @Input() product!: Product;
  /** Trigger when delete or update */
  @Output() update = new EventEmitter();

  optionsOpen = signal(false);
  deleteModalOpen = signal(false);
  editModalOpen = signal(false);

  @ViewChild("menu") menu!: ElementRef<HTMLDivElement>;
  @ViewChild("visibility") visibility!: ElementRef<HTMLDivElement>;
  @ViewChild("cta") cta!: ElementRef<HTMLDivElement>;

  isOwnProduct = computed(
    () => this.product.vendor.id === this.authService.user()?.id,
  );

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private notificationService: NotificationService,
  ) {}

  get formattedPrice(): string {
    return Number(this.product.price).toFixed(2);
  }

  async toggleVisibility(): Promise<void> {
    try {
      await this.productService.updateProduct({
        ...this.product,
        category: this.product.category.id,
        isVisible: !this.product.isVisible,
      });
      // this.notificationService.addNotification({
      //   type: "success",
      //   message: this.product.isVisible
      //     ? `${this.product.name} is now hidden`
      //     : `${this.product.name} is now visible`,
      //   duration: 1000,
      // });
      this.update.emit();
    } catch (error) {
      this.notificationService.addNotification({
        type: "error",
        message: `Couldn't update "${this.product.name}".`,
        duration: 2000,
      });
    }
  }

  onCardClick(event: MouseEvent) {
    if (
      [this.menu, this.visibility, this.cta].some((el) =>
        el.nativeElement.contains(event.target as Node),
      )
    ) {
      return;
    }
    console.log("test");
  }

  onClickCTA() {}

  onDeleteSuccess() {
    this.deleteModalOpen.set(false);
    this.update.emit();
  }
  onProductUpdated() {
    this.editModalOpen.set(false);
    this.update.emit();
  }
}

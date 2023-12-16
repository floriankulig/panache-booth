import {
  Component,
  WritableSignal,
  computed,
  effect,
  signal,
} from "@angular/core";
import { IconsModule } from "../../icons/icons.module";
import { ModalComponent } from "../../components/modal/modal.component";
import {
  AddProductComponent,
  ProductCardComponent,
} from "../../components/product";
import {
  AuthService,
  NotificationService,
  ProductService,
} from "../../services";
import { Product } from "../../../models";

@Component({
  selector: "pb-warehouse",
  standalone: true,
  imports: [
    IconsModule,
    ModalComponent,
    AddProductComponent,
    ProductCardComponent,
  ],
  templateUrl: "./warehouse.component.html",
  styleUrl: "./warehouse.component.scss",
})
export class WarehouseComponent {
  addProductModalOpen = signal(false);
  ownedProducts: WritableSignal<Product[]> = signal([]);

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {
    this.getOwnedProducts(this.authService.user()?.id);
    effect(() => {
      console.log(this.ownedProducts());
    });
  }

  private async getOwnedProducts(vendorId?: string) {
    if (!vendorId) return;
    try {
      const products = await this.productService.getProducts(vendorId);
      this.ownedProducts.set(products);
    } catch (error) {
      this.notificationService.addNotification({
        message: "Couldn't load products.",
        type: "error",
        duration: 5000,
      });
    }
  }

  openAddProductModal() {
    this.addProductModalOpen.set(true);
  }

  updateList() {
    this.getOwnedProducts(this.authService.user()?.id);
  }

  onProductCreated() {
    this.addProductModalOpen.set(false);
    this.getOwnedProducts();
  }
}

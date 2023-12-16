import { Component, computed, effect, signal } from "@angular/core";
import { IconsModule } from "../../icons/icons.module";
import { ModalComponent } from "../../components/modal/modal.component";
import { AddProductComponent } from "../../components/product";
import { AuthService, ProductService } from "../../services";

@Component({
  selector: "pb-warehouse",
  standalone: true,
  imports: [IconsModule, ModalComponent, AddProductComponent],
  templateUrl: "./warehouse.component.html",
  styleUrl: "./warehouse.component.scss",
})
export class WarehouseComponent {
  addProductModalOpen = signal(false);
  ownedProducts = computed(() =>
    this.productService
      .products()
      .filter((product) => product.vendor?.id === this.authService.user()?.id),
  );

  constructor(
    private productService: ProductService,
    private authService: AuthService,
  ) {
    effect(() => {
      console.log(this.ownedProducts());
    });
  }

  openAddProductModal() {
    this.addProductModalOpen.set(true);
  }
}

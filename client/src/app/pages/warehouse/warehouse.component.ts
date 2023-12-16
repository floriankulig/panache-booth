import { Component, effect, signal } from "@angular/core";
import { IconsModule } from "../../icons/icons.module";
import { ModalComponent } from "../../components/modal/modal.component";
import { AddProductComponent } from "../../components/product";
import { ProductService } from "../../services";

@Component({
  selector: "pb-warehouse",
  standalone: true,
  imports: [IconsModule, ModalComponent, AddProductComponent],
  templateUrl: "./warehouse.component.html",
  styleUrl: "./warehouse.component.scss",
})
export class WarehouseComponent {
  addProductModalOpen = signal(false);

  constructor(private productService: ProductService) {
    effect(() => {
      console.log(this.productService.products());
    });
  }

  openAddProductModal() {
    this.addProductModalOpen.set(true);
  }
}

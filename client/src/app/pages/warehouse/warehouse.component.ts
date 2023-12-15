import { Component, signal } from "@angular/core";
import { IconsModule } from "../../icons/icons.module";
import { ModalComponent } from "../../components/modal/modal.component";

@Component({
  selector: "pb-warehouse",
  standalone: true,
  imports: [IconsModule, ModalComponent],
  templateUrl: "./warehouse.component.html",
  styleUrl: "./warehouse.component.scss",
})
export class WarehouseComponent {
  addProductModalOpen = signal(false);

  openAddProductModal() {
    this.addProductModalOpen.set(true);
  }
}

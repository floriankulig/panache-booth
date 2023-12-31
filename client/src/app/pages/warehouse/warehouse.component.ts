import { Component, WritableSignal, computed, signal } from "@angular/core";
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
import { ActivatedRoute } from "@angular/router";
import { filterByString } from "../../../helpers";

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
  searchFilter: WritableSignal<string> = signal("");

  filteredOwnedProducts = computed(() => {
    return filterByString(
      this.ownedProducts().map((product) => ({
        ...product,
        vendorName: product.vendor.userName,
      })),
      this.searchFilter(),
      {
        include: ["name", "vendorName", "category", "description", "price"],
      },
    ).map((prod) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { vendorName, ...product } = prod;
      return product;
    }) as Product[];
  });

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
  ) {
    this.updateList();

    this.route.queryParams.subscribe((params) => {
      const search = params["q"];
      this.searchFilter.set(search || "");
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
    this.updateList();
  }
}

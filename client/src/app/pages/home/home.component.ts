import { Component, computed } from "@angular/core";
import { ProductCardComponent } from "../../components/product";
import { ProductService } from "../../services";

@Component({
  selector: "pb-home",
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
})
export class HomeComponent {
  shownProducts = computed(() =>
    this.productService.products().filter((product) => product.isVisible),
  );

  constructor(private productService: ProductService) {}

  updateList() {
    this.productService.getProducts();
  }
}

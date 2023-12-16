import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Product } from "../../../../models";

@Component({
  selector: "pb-product-card",
  standalone: true,
  imports: [],
  templateUrl: "./product-card.component.html",
  styleUrl: "./product-card.component.scss",
})
export class ProductCardComponent {
  @Input() product!: Product;
  /** Trigger when delete or update */
  @Output() update = new EventEmitter();
}

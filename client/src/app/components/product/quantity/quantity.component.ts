import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IconsModule } from "../../../icons/icons.module";
import { PositiveNumberDirective } from "../../../directives/positive-number.directive";

@Component({
  selector: "pb-quantity",
  standalone: true,
  imports: [IconsModule, PositiveNumberDirective],
  templateUrl: "./quantity.component.html",
  styleUrl: "./quantity.component.scss",
})
export class QuantityComponent {
  @Input() value!: number;
  @Input() min: number = 1;
  @Input() max?: number;
  @Input() label?: string;
  @Input() disabled?: boolean;
  @Output() valueChange = new EventEmitter<number>();

  increment() {
    if (this.max && this.value >= this.max) {
      return;
    }
    this.valueChange.emit(this.value + 1);
  }
  decrement() {
    if (this.value <= this.min) {
      return;
    }
    this.valueChange.emit(this.value - 1);
  }

  onChange(event: Event) {
    let newValue = (event.target as HTMLInputElement).valueAsNumber;
    console.log("blur");
    console.log(newValue);
    if (!newValue || isNaN(newValue)) {
      newValue = this.min;
    }

    newValue = Math.min(newValue, this.max || Infinity);
    newValue = Math.max(newValue, this.min);

    (event.target as HTMLInputElement).value = newValue.toString();
    this.valueChange.emit(newValue);
  }
}

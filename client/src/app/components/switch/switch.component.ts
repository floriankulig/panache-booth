import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  WritableSignal,
} from "@angular/core";
import { IconsModule } from "../../icons/icons.module";

@Component({
  selector: "pb-switch",
  standalone: true,
  imports: [IconsModule],
  templateUrl: "./switch.component.html",
  styleUrl: "./switch.component.scss",
})
export class SwitchComponent {
  @Input() value!: boolean | WritableSignal<boolean>;
  @Output() valueChange = new EventEmitter<boolean>();

  @Input() activeIcon = "check";
  @Input() inactiveIcon = "x";

  constructor() {}

  get isActive() {
    return typeof this.value === "boolean" ? this.value : this.value();
  }

  @HostListener("click")
  onToggle() {
    const newValue =
      typeof this.value === "boolean" ? !this.value : !this.value();
    this.valueChange.emit(newValue);
  }
}

import {
  Component,
  EventEmitter,
  Input,
  Output,
  ElementRef,
} from "@angular/core";
import {
  trigger,
  transition,
  animate,
  style,
  query,
  animateChild,
} from "@angular/animations";
import { IconsModule } from "../../icons/icons.module";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-modal",
  standalone: true,
  imports: [IconsModule, CommonModule],
  templateUrl: "./modal.component.html",
  styleUrl: "./modal.component.scss",
  animations: [
    trigger("modal", [
      transition("* <=> *", [
        query("@modalAnimation", animateChild(), {
          optional: true,
        }),
      ]),
    ]),
    trigger("modalAnimation", [
      transition(":enter", [
        style({ opacity: 0, scale: 0.94, transform: "translateY(50%)" }),
        animate(
          "150ms cubic-bezier(0.645, 0.045, 0.355, 1)",
          style({ opacity: 1, scale: 1, transform: "translateY(0)" }),
        ),
      ]),
      transition(":leave", [
        style({ opacity: 1, scale: 1, transform: "translateY(0)" }),
        animate(
          "150ms cubic-bezier(0.645, 0.045, 0.355, 1)",
          style({ opacity: 0, scale: 0.95, transform: "translateY(20%)" }),
        ),
      ]),
    ]),
  ],
})
export class ModalComponent {
  @Input() title = "";
  @Input() open?: boolean;
  @Output() close = new EventEmitter<void>();

  constructor(public elem: ElementRef) {
    console.log(this.elem.nativeElement);
  }

  onClose() {
    this.close.emit();
  }
}

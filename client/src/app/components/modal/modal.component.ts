import {
  Component,
  EventEmitter,
  Input,
  Output,
  HostBinding,
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
  selector: "pb-modal",
  standalone: true,
  imports: [IconsModule, CommonModule],
  templateUrl: "./modal.component.html",
  styleUrl: "./modal.component.scss",
  animations: [
    trigger("modal", [
      transition("* <=> *", [
        query("@modalAnimation, @backdrop", animateChild(), {
          optional: true,
        }),
      ]),
    ]),
    trigger("modalAnimation", [
      transition(":enter", [
        style({
          opacity: 0.3,
          scale: 0.95,
          transform: "translateY(100%) rotateX(10deg)",
        }),
        animate(
          "250ms cubic-bezier(0.645, 0.045, 0.355, 1)",
          style({
            opacity: 1,
            scale: 1,
            transform: "translateY(0) rotateX(0deg)",
          }),
        ),
      ]),
      transition(":leave", [
        style({ opacity: 1, scale: 1, transform: "translateY(0)" }),
        animate(
          "150ms cubic-bezier(0.645, 0.045, 0.355, 1)",
          style({
            opacity: 0,
            scale: 0.95,
            transform: "translateY(30%) rotateX(2deg)",
          }),
        ),
      ]),
    ]),
    trigger("backdrop", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("200ms", style({ opacity: 1 })),
      ]),
      transition(":leave", [
        style({ opacity: 1 }),
        animate("300ms", style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class ModalComponent {
  @Input() heading = "";
  @Input() open?: boolean;
  @Output() close = new EventEmitter<void>();

  @HostBinding("@modal") get animation() {
    return true;
  }

  onClose() {
    this.close.emit();
  }
}

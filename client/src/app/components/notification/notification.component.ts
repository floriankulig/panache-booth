import {
  ViewChild,
  Component,
  Input,
  ElementRef,
  HostBinding,
} from "@angular/core";
import { Notification, NotificationService } from "../../services";
import { IconsModule } from "../../icons/icons.module";
import {
  animate,
  animateChild,
  query,
  style,
  transition,
  trigger,
} from "@angular/animations";

@Component({
  selector: "pb-notification",
  standalone: true,
  imports: [IconsModule],
  templateUrl: "./notification.component.html",
  styleUrl: "./notification.component.scss",
  animations: [
    trigger("notification", [
      transition(":enter", [
        style({ transform: "scale(0)", transformOrigin: "bottom right" }),
        animate(`200ms ease-in-out`, style({ transform: "scale(1)" })),
        query("@progress", animateChild(), {
          optional: true,
        }),
      ]),
      transition(":leave", [
        style({ transform: "scale(1)", transformOrigin: " bottom right" }),
        animate(`200ms 50ms ease-in-out`, style({ transform: "scale(0)" })),
      ]),
    ]),
    trigger("progress", [
      transition(":enter", [
        style({ transform: "scaleX(0)", transformOrigin: "left" }),
        animate(`{{ animationDuration }}ms`, style({ transform: "scaleX(1)" })),
      ]),
    ]),
  ],
})
export class NotificationComponent {
  @Input() notification!: Notification;
  @Input() index!: number;
  @ViewChild("progress") progressBar!: ElementRef<HTMLDivElement>;

  @HostBinding("@notification") get notificationAnimation() {
    return true;
  }

  constructor(private notificationService: NotificationService) {}

  get iconName() {
    if (this.notification.icon) return this.notification.icon;
    switch (this.notification.type) {
      case "success":
        return "check-circle";
      case "error":
        return "alert-circle";
      case "warning":
        return "alert-triangle";
      default:
        return "info";
    }
  }

  get shouldAnimate() {
    return (this.notification.duration || 0) > 1000;
  }

  get classes() {
    return {
      notification: true,
      [this.notification.type || "info"]: true,
    };
  }

  removeNotification() {
    this.notificationService.removeNotification(this.notification);
  }
}

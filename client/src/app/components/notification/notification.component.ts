import { ViewChild, Component, Input, ElementRef } from "@angular/core";
import { Notification, NotificationService } from "../../services";
import { IconsModule } from "../../icons/icons.module";
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
  selector: "app-notification",
  standalone: true,
  imports: [IconsModule],
  templateUrl: "./notification.component.html",
  styleUrl: "./notification.component.scss",
  animations: [
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

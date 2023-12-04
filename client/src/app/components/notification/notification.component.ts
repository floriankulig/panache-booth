import {
  AfterViewInit,
  ViewChild,
  Component,
  Input,
  ElementRef,
} from "@angular/core";
import { Notification, NotificationService } from "../../services";
import { IconsModule } from "../../icons/icons.module";

@Component({
  selector: "app-notification",
  standalone: true,
  imports: [IconsModule],
  templateUrl: "./notification.component.html",
  styleUrl: "./notification.component.scss",
})
export class NotificationComponent implements AfterViewInit {
  @Input() notification!: Notification;
  @Input() index!: number;
  @ViewChild("progress") progressBar!: ElementRef<HTMLDivElement>;

  constructor(
    private notificationService: NotificationService,
    private elementRef: ElementRef,
  ) {}

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

  ngAfterViewInit() {
    if (this.notification.duration || 0 >= 1000) {
      this.progressBar.nativeElement.style.animationDuration = `${this.notification.duration}ms`;
    } else {
      this.progressBar.nativeElement.style.animation = "none";
    }
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

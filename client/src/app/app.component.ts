import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LayoutComponent } from "./layout/layout.component";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { isAuthUrl } from "../helpers";
import { AuthComponent } from "./layout/auth/auth.component";
import { NotificationService } from "./services";
import { NotificationComponent } from "./components/notification/notification.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    LayoutComponent,
    RouterOutlet,
    AuthComponent,
    NotificationComponent,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  showLayout = true;
  activeNotifications = this.notificationService.notifications;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
  ) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.showLayout = !isAuthUrl(val.url);
      }
    });
  }

  removeNotification(notificationIndex: number) {
    this.notificationService.removeNotification(notificationIndex);
  }
}

import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LayoutComponent } from "./layout/layout.component";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { isAuthUrl } from "../helpers";
import { AuthComponent } from "./layout/auth/auth.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, LayoutComponent, RouterOutlet, AuthComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  showLayout = true;
  constructor(private router: Router) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.showLayout = !isAuthUrl(val.url);
      }
    });
  }
}

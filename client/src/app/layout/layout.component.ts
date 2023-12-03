import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { HeaderComponent } from "./header/header.component";
import { OutsideClickDirective } from "../directives/outside-click.directive";

@Component({
  selector: "app-layout",
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  templateUrl: "./layout.component.html",
  styleUrl: "./layout.component.scss",
})
export class LayoutComponent {
  sidebarOpen = signal(false);

  closeSidebar() {
    this.sidebarOpen.set(false);
  }
}

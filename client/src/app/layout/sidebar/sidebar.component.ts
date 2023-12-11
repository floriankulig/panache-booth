import { EventEmitter, Component, Output } from "@angular/core";
import { IconsModule } from "../../icons/icons.module";
import { LogoComponent } from "../../components/logo/logo.component";
import { RouterModule } from "@angular/router";

@Component({
  selector: "pb-sidebar",
  standalone: true,
  imports: [IconsModule, LogoComponent, RouterModule],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.scss",
})
export class SidebarComponent {
  @Output() close = new EventEmitter();

  closeSidebar() {
    this.close.emit();
  }
}

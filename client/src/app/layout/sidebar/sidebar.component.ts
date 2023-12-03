import { EventEmitter, Component, Output } from "@angular/core";
import { IconsModule } from "../../icons/icons.module";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [IconsModule],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.scss",
})
export class SidebarComponent {
  @Output() close = new EventEmitter();

  closeSidebar() {
    this.close.emit();
  }
}

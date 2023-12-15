import { EventEmitter, Component, Output, computed } from "@angular/core";
import { IconsModule } from "../../icons/icons.module";
import { LogoComponent } from "../../components/logo/logo.component";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { SIDEBAR_TABS } from "../../../ts";
import { AuthService } from "../../services";

@Component({
  selector: "pb-sidebar",
  standalone: true,
  imports: [IconsModule, LogoComponent, RouterModule],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.scss",
})
export class SidebarComponent {
  @Output() close = new EventEmitter();
  currentUrl: string = "/";
  tabs = SIDEBAR_TABS;
  visibleTabs = computed(() => this.tabsForUser);

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
        console.log(this.currentUrl);
      }
    });
  }

  get tabsForUser() {
    const secondTabGroup = !!this.authService.user()
      ? this.authService.user()?.isVendor
        ? this.tabs[2]
        : this.tabs[1]
      : undefined;
    if (!secondTabGroup) {
      return [this.tabs[0]];
    }
    return [this.tabs[0], secondTabGroup];
  }

  closeSidebar() {
    this.close.emit();
  }
}

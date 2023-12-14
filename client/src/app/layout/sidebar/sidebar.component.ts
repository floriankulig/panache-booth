import { EventEmitter, Component, Output } from "@angular/core";
import { IconsModule } from "../../icons/icons.module";
import { LogoComponent } from "../../components/logo/logo.component";
import { NavigationEnd, Router, RouterModule } from "@angular/router";

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
  tabs = [
    {
      name: "",
      links: [
        {
          name: "Home",
          url: "/",
          icon: "home",
        },
        // {
        //   name: "Categories",
        //   url: "/categories",
        //   icon: "grid",
        // },
        {
          name: "Profile",
          url: "/profile",
          icon: "user",
        },
      ],
    },
    {
      name: "Your Shop",
      links: [
        {
          name: "Warehouse",
          url: "/profile/warehouse",
          icon: "truck",
        },
        {
          name: "Orders",
          url: "/profile/orders",
          icon: "package",
        },
      ],
    },
  ];

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
        console.log(this.currentUrl);
      }
    });
  }

  closeSidebar() {
    this.close.emit();
  }
}

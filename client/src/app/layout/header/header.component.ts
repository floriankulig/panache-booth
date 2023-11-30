import { signal, Component } from "@angular/core";
import { SearchbarComponent } from "./searchbar/searchbar.component";
import { IconsModule } from "../../icons/icons.module";
import { ProfileMenuComponent } from "./profile-menu/profile-menu.component";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [SearchbarComponent, IconsModule, ProfileMenuComponent],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent {
  productsInCart = signal(7);
}

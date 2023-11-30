import { signal, Component, ElementRef } from "@angular/core";
import { IconsModule } from "../../../icons/icons.module";

@Component({
  selector: "app-profile-menu",
  standalone: true,
  imports: [IconsModule],
  templateUrl: "./profile-menu.component.html",
  styleUrl: "./profile-menu.component.scss",
})
export class ProfileMenuComponent {
  open = signal(false);

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    document.addEventListener("click", (event) => {
      if (
        !this.elementRef.nativeElement.contains(event.target) &&
        this.open()
      ) {
        this.open.set(false);
      }
    });
  }

  toggleMenu() {
    this.open.update((open) => !open);
  }
}

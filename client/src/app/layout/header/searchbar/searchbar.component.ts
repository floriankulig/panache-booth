import { Component, computed, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IconsModule } from "../../../icons/icons.module";

@Component({
  selector: "pb-searchbar",
  standalone: true,
  imports: [IconsModule],
  templateUrl: "./searchbar.component.html",
  styleUrl: "./searchbar.component.scss",
})
export class SearchbarComponent {
  search = signal("");

  clearButtonClasses = computed(() => ({
    clear: true,
    hidden: !this.search(),
  }));

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.search.set(params["q"] || "");
    });
  }

  updateQuery(event: Event) {
    const input = event.target as HTMLInputElement;
    this.search.set(input.value);

    const queryParams = { q: this.search() || undefined };

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams,
      queryParamsHandling: "merge",
      replaceUrl: true,
    });
  }

  clearSearch() {
    this.search.set("");

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { q: undefined },
      queryParamsHandling: "merge",
      replaceUrl: true,
    });
  }
}

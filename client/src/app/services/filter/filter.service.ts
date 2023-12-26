import { Injectable, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class FilterService {
  searchFilter = signal("");
  private _searchbarPlaceholderDefault = "Search for a product";
  private _searchbarPlaceholder = this._searchbarPlaceholderDefault;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      const search = params["q"];
      this.searchFilter.set(search || "");
    });
  }

  get searchbarPlaceholder(): string {
    return this._searchbarPlaceholder;
  }

  set searchbarPlaceholder(value: string) {
    this._searchbarPlaceholder = value;
  }

  resetSearchbarPlaceholder() {
    this._searchbarPlaceholder = this._searchbarPlaceholderDefault;
  }
}

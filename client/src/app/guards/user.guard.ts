import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { AuthService } from "../services";
import { Location } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class UserGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private location: Location,
  ) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean> {
    const uid = this.authService.uidFromLocalStorage();
    if (!uid) {
      this.router.navigate(["/login?redirect=" + state.url]);
      return false;
    }
    const user =
      this.authService.user() || (await this.authService.getUser(uid));
    if (!user) {
      // If there's a redirect query parameter, use it
      if (next.queryParams["redirect"]) {
        this.router.navigate([next.queryParams["redirect"]]);
      } else {
        if (this.router.navigated) {
          this.location.back();
        } else {
          // If the last visited page is not within the app, redirect to "/"
          this.router.navigate(["/"]);
        }
      }
      return false;
    } else {
      return true;
    }
  }
}

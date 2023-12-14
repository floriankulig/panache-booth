import { Injectable, effect } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { AuthService } from "../services";

@Injectable({
  providedIn: "root",
})
export class VendorGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {
    effect(() => {
      if (!this.authService.user() && !this.authService.uidFromLocalStorage()) {
        this.router.navigate(["/"]);
      }
    });
  }

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
    if (!user?.isVendor) {
      return false;
    } else {
      return true;
    }
  }
}

import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  // RouterStateSnapshot,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services";
import { Location } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private location: Location,
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.uidFromLocalStorage()) {
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

import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { AuthGuard } from "./guards/auth-pages.guard";
import { UserGuard } from "./guards/user.guard";
import { WarehouseComponent } from "./pages/warehouse/warehouse.component";
import { VendorGuard } from "./guards/vendor.guard";
import { HomeComponent } from "./pages/home/home.component";

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginComponent, canActivate: [AuthGuard] },
  { path: "register", component: RegisterComponent, canActivate: [AuthGuard] },
  {
    path: "update-profile",
    component: RegisterComponent,
    canActivate: [UserGuard],
  },
  { path: "profile", component: ProfileComponent },
  {
    path: "profile/warehouse",
    component: WarehouseComponent,
    canActivate: [VendorGuard],
  },
];

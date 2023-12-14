import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { AuthGuard } from "./guards/auth-pages.guard";
import { UserGuard } from "./guards/user.guard";

export const routes: Routes = [
  { path: "login", component: LoginComponent, canActivate: [AuthGuard] },
  { path: "register", component: RegisterComponent, canActivate: [AuthGuard] },
  {
    path: "update-profile",
    component: RegisterComponent,
    canActivate: [UserGuard],
  },
  { path: "profile", component: ProfileComponent },
];

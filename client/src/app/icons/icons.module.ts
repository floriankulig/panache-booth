import { NgModule } from "@angular/core";

import { FeatherModule } from "angular-feather";
import {
  Search,
  X,
  ShoppingBag,
  ShoppingCart,
  User,
  UserCheck,
  UserPlus,
  LogOut,
} from "angular-feather/icons";

// Select some icons (use an object, not an array)
const icons = {
  Search,
  X,
  ShoppingBag,
  ShoppingCart,
  User,
  LogOut,
  UserCheck,
  UserPlus,
};

@NgModule({
  imports: [FeatherModule.pick(icons)],
  exports: [FeatherModule],
})
export class IconsModule {}

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
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Menu,
  Info,
  Smile,
  Home,
  CreditCard,
  Truck,
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
  Smile,
  Menu,
  Info,
  Home,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Truck,
  AlertTriangle,
};

@NgModule({
  imports: [FeatherModule.pick(icons)],
  exports: [FeatherModule],
})
export class IconsModule {}

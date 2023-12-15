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
  Package,
  Grid,
  Plus,
  ArrowLeft,
  Smile,
  Trash,
  Trash2,
  Edit3,
  UserX,
  FileMinus,
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
  Trash,
  Trash2,
  Edit3,
  UserX,
  FileMinus,
  Menu,
  Info,
  Package,
  Grid,
  Plus,
  ArrowLeft,
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

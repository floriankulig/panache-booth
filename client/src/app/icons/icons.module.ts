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
  ChevronLeft,
  Info,
  Package,
  Grid,
  MoreVertical,
  Eye,
  EyeOff,
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
  Frown,
  Calendar,
  ChevronDown,
  ExternalLink,
  Minus,
  Check,
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
  ChevronLeft,
  Info,
  Package,
  MoreVertical,
  Eye,
  EyeOff,
  Grid,
  Plus,
  ArrowLeft,
  Home,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Truck,
  Frown,
  Calendar,
  ChevronDown,
  ExternalLink,
  Minus,
  Check,
  AlertTriangle,
};

@NgModule({
  imports: [FeatherModule.pick(icons)],
  exports: [FeatherModule],
})
export class IconsModule {}

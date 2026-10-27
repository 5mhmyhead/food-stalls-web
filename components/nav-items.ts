import {
  Home,
  Utensils,
  ShoppingBag,
  History,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";

export type NavIcon = LucideIcon;

export interface NavItem {
  label: string;
  href: string;
  icon: NavIcon;
}

export const TOP_NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    href: "/home",
    icon: Home,
  },
  {
    label: "Menu",
    href: "/menu",
    icon: Utensils,
  },
  {
    label: "Orders",
    href: "/orders",
    icon: ShoppingBag,
  },
  {
    label: "History",
    href: "/history",
    icon: History,
  },
];

export const BOTTOM_NAV_ITEMS: NavItem[] = [
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    label: "Sign Out",
    href: "/",
    icon: LogOut,
  },
];
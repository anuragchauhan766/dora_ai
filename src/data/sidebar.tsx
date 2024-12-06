import { NavMainItems } from "@/types/sidebar";
import { LayoutDashboard, LifeBuoy, Send } from "lucide-react";

export const navitems: NavMainItems[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: true,
  },
];

export const navSecondary: NavMainItems[] = [
  {
    title: "Support",
    url: "#",
    icon: LifeBuoy,
  },
  {
    title: "Feedback",
    url: "#",
    icon: Send,
  },
];

import { LucideIcon } from "lucide-react";

export interface NavMainItems {
  title: string;
  url: string;
  isActive?: boolean;
  icon: LucideIcon;
  items?: {
    title: string;
    url: string;
  }[];
}

"use client";
import { FileText, History, LayoutDashboard, MessageSquare, Settings } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { SelectProject } from "@/types/project";
import { NavMainItems } from "@/types/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavProjectSectionProps {
  project: SelectProject;
}
const projectNavItems: NavMainItems[] = [
  { title: "Overview", url: "", icon: LayoutDashboard },
  { title: "Chat", url: "/chat", icon: MessageSquare },
  { title: "Conversation History", url: "/conversation", icon: History },
  { title: "Documents", url: "/documents", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
];
export function NavProjectSection({ project }: NavProjectSectionProps) {
  const pathname = usePathname();
  const isItemActive = (itemUrl: string) => {
    const fullPath = `/project/${project.id}${itemUrl}`;

    // For overview (empty URL), check exact match
    if (itemUrl === "") {
      return pathname === `/project/${project.id}`;
    }

    // For other items, check if pathname starts with the full path
    return pathname.startsWith(fullPath);
  };
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="flex items-center justify-between font-bold">{project.name}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {projectNavItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isItemActive(item.url)}>
                <Link href={`/project/${project.id}/${item.url}`}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

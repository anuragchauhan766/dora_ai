import { getProjects } from "@/actions/project/getProject";
import { Briefcase, MoreHorizontal } from "lucide-react";

import { SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
export async function NavProjects() {
  const projects = await getProjects();
  if (!projects) {
    return null;
  }

  return (
    <SidebarMenu>
      {projects.map((item) => (
        <SidebarMenuItem key={item.name}>
          <SidebarMenuButton asChild>
            <Link href={`/project/${item.id}`}>
              <Briefcase className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          </SidebarMenuButton>

          <SidebarMenuAction showOnHover>
            <MoreHorizontal />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </SidebarMenuItem>
      ))}
      <SidebarMenuItem>
        <SidebarMenuButton>
          <MoreHorizontal />
          <span>More</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

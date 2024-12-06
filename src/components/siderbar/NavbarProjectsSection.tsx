import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus } from "lucide-react";

import { SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel } from "@/components/ui/sidebar";
import { Suspense } from "react";
import { NavProjects } from "./NavProjects";
import { NavProjectsSkeleton } from "./SidebarSkeleton";

export async function NavProjectsSection() {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="flex items-center justify-between">Projects</SidebarGroupLabel>
      <Tooltip>
        <TooltipTrigger asChild>
          <SidebarGroupAction>
            <Plus className="h-4 w-4" /> <span className="sr-only">Add Project</span>
          </SidebarGroupAction>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add Project</p>
        </TooltipContent>
      </Tooltip>
      <SidebarGroupContent>
        <Suspense fallback={<NavProjectsSkeleton />}>
          <NavProjects />
        </Suspense>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

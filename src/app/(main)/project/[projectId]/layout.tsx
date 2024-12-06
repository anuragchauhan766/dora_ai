import BreadcrumbCustom from "@/components/header/Breadcrumb";
import React from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { getProject } from "@/actions/project/getProject";
import { AppSidebar } from "@/components/app-sidebar";
import { NavSecondary } from "@/components/nav-secondary";
import { UserButton } from "@clerk/nextjs";
import { HelpCircle, MessageSquare } from "lucide-react";
import { NavProjectSection } from "@/components/siderbar/ProjectSidebar";
import { NavMain } from "@/components/nav-main";
import { RecentChatsSection } from "@/components/siderbar/RecentChatsSection";

async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProject(projectId);
  return (
    <div className="flex min-h-screen flex-col">
      <SidebarProvider>
        <AppSidebar>
          <NavMain />
          {project && <NavProjectSection project={project} />}
          <RecentChatsSection />
          <NavSecondary className="mt-auto" />
        </AppSidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <BreadcrumbCustom projects={project ? [project] : []} />
            </div>
            <div className="ml-auto flex items-center space-x-4 px-3">
              <Button variant="ghost" size="icon">
                <MessageSquare className="h-5 w-5" />
                <span className="sr-only">Feedback</span>
              </Button>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5" />
                <span className="sr-only">Help</span>
              </Button>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "size-8",
                  },
                }}
              />
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default ProjectLayout;

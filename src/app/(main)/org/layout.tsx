import { SyncActiveOrganization } from "@/lib/utils/sync-active-organization";
import { auth } from "@clerk/nextjs/server";
import { type PropsWithChildren } from "react";

import BreadcrumbCustom from "@/components/header/Breadcrumb";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { getProjects } from "@/actions/project/getProject";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/common/themeToggle";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavProjectsSection } from "@/components/siderbar/NavbarProjectsSection";
import { UserButton } from "@clerk/nextjs";
import { HelpCircle, MessageSquare } from "lucide-react";
import { redirect } from "next/navigation";

async function OrganizationLayoutWithSidebar({ children }: { children: React.ReactNode }) {
  const projects = await getProjects();
  return (
    <div className="flex min-h-screen flex-col">
      <SidebarProvider>
        <AppSidebar>
          <NavMain />
          <NavProjectsSection />
          <NavSecondary className="mt-auto" />
        </AppSidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <BreadcrumbCustom projects={projects} />
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
              <ThemeToggle />
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "size-8",
                  },
                }}
              />
            </div>
          </header>
          <div className="flex-1">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default async function OrganizationLayout(props: PropsWithChildren) {
  const { orgId } = await auth();

  if (orgId) {
    return (
      <OrganizationLayoutWithSidebar>
        <SyncActiveOrganization />
        {props.children}
      </OrganizationLayoutWithSidebar>
    );
  }
  return redirect("/org-selection");
}

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "@/components/ui/sidebar";
import { Suspense } from "react";
import { RecentChats } from "./RecentChats";
import { NavProjectsSkeleton } from "./SidebarSkeleton";

interface RecentChatsSectionProps {
  projectId: string;
}
export async function RecentChatsSection({ projectId }: RecentChatsSectionProps) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="flex items-center justify-between">Recent Chats</SidebarGroupLabel>

      <SidebarGroupContent>
        <Suspense fallback={<NavProjectsSkeleton />}>
          <RecentChats projectId={projectId} />
        </Suspense>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

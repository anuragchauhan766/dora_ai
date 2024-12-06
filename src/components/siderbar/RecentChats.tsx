import { ArrowRight, MessageSquare, MoreHorizontal, Plus } from "lucide-react";

import { SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";

interface RecentChat {
  id: string;
  name: string;
  project: string;
  projectId: string;
  lastMessage: string;
  timestamp: string;
  unread?: boolean;
}

const recentChats: RecentChat[] = [
  {
    id: "chat1",
    name: "Product Feature Discussion",
    project: "Marketing Campaign",
    projectId: "proj1",
    lastMessage: "What are the key features we should highlight?",
    timestamp: "2h ago",
    unread: true,
  },
  {
    id: "chat2",
    name: "Customer Support Analysis",
    project: "Support Enhancement",
    projectId: "proj2",
    lastMessage: "Let's review the common support patterns",
    timestamp: "5h ago",
  },
  {
    id: "chat3",
    name: "Data Analysis Report",
    project: "Analytics Dashboard",
    projectId: "proj3",
    lastMessage: "Here's the quarterly performance breakdown",
    timestamp: "1d ago",
  },
];
export async function RecentChats() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton className="flex items-center justify-center rounded-lg bg-primary p-2 text-base text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground sm:text-lg">
          <Plus />
          <span>New Chat</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      {recentChats.map((chat) => (
        <SidebarMenuItem key={chat.id}>
          <SidebarMenuButton asChild className="flex flex-col items-start justify-center gap-1">
            <Link href={`/project/${chat.projectId}/chat/${chat.id}`}>
              <div className="flex w-full items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                <span className="line-clamp-1 flex-1 font-medium">{chat.name}</span>
              </div>
            </Link>
          </SidebarMenuButton>

          <SidebarMenuAction showOnHover>
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </SidebarMenuItem>
      ))}
      <SidebarMenuItem>
        <SidebarMenuButton>
          <ArrowRight />
          <span>View All</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

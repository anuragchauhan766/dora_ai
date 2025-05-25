import { ArrowRight, MessageSquare, MoreHorizontal, Plus } from "lucide-react";

import { SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db/database";
import { chats, messages } from "@/db/schema";

interface RecentChatsProps {
  projectId: string;
}

export async function RecentChats({ projectId }: RecentChatsProps) {
  const recentChats = await db.query.chats.findMany({
    where: eq(chats.projectId, projectId),
    with: {
      messages: {
        orderBy: [desc(messages.createdAt)],
        limit: 1,
      },
    },
    orderBy: [desc(chats.updatedAt)],
  });

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          className="flex items-center justify-center rounded-2xl bg-primary p-2 text-sm text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground sm:text-base"
          asChild
        >
          <Link href={`/project/${projectId}/chat`}>
            <Plus />
            <span>New Chat</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      {recentChats.map((chat) => (
        <SidebarMenuItem key={chat.id}>
          <SidebarMenuButton asChild className="flex flex-col items-start justify-center gap-1">
            <Link href={`/project/${chat.projectId}/chat/${chat.id}`}>
              <div className="flex w-full items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                <span className="line-clamp-1 flex-1 font-medium">{chat.messages[0].content || "New Chat"}</span>
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
        <SidebarMenuButton asChild>
          <Link href={`/project/${projectId}/conversation`}>
            <ArrowRight />
            <span>View All</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

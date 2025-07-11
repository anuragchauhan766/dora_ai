import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, MoreVertical, MessageSquare, FileText, Trash2 } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { db } from "@/db/database";
import { chats, messages } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import Link from "next/link";
import { ConversationSearch } from "./conversation-search";

async function getChatStats(projectId: string) {
  const totalChats = await db
    .select({ count: sql<number>`count(*)` })
    .from(chats)
    .where(eq(chats.projectId, projectId));

  const thisMonthChats = await db
    .select({ count: sql<number>`count(*)` })
    .from(chats)
    .where(sql`${chats.projectId} = ${projectId} AND ${chats.createdAt} >= date_trunc('month', CURRENT_DATE)`);

  return {
    total: totalChats[0].count,
    thisMonth: thisMonthChats[0].count,
  };
}

async function getChats(projectId: string, searchQuery?: string) {
  const projectChats = await db.query.chats.findMany({
    where: searchQuery
      ? sql`${chats.projectId} = ${projectId} AND EXISTS (
          SELECT 1 FROM ${messages} m
          WHERE m.chat_id = ${chats.id} 
          AND m.content ILIKE ${`%${searchQuery}%`}
        )`
      : eq(chats.projectId, projectId),
    with: {
      messages: {
        orderBy: [desc(messages.createdAt)],
        limit: 1,
      },
    },
    orderBy: [desc(chats.updatedAt)],
  });

  return projectChats.map((chat) => {
    const lastMessage = chat.messages[0]?.content || "New Chat";
    const firstLine = lastMessage.split("\n")[0];
    const truncatedTitle = firstLine.length > 50 ? firstLine.substring(0, 50) + "..." : firstLine;

    return {
      id: chat.id,
      title: truncatedTitle,
      messages: chat.messages.length,
      created: chat.createdAt,
      lastActive: formatDistanceToNow(chat.updatedAt, { addSuffix: true }),
    };
  });
}

export default async function ConversationHistory(
  props: {
    params: Promise<{ projectId: string }>;
    searchParams: Promise<{ q?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const stats = await getChatStats(params.projectId);
  const conversations = await getChats(params.projectId, searchParams.q);

  return (
    <div className="space-y-6 p-4">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Chats</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">{stats.thisMonth}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <ConversationSearch projectId={params.projectId} />

      {/* Conversations List */}
      <Card>
        <CardContent className="p-0">
          {/* Desktop View */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left font-medium">Title</th>
                  <th className="p-4 text-left font-medium">Messages</th>
                  <th className="p-4 text-left font-medium">Created</th>
                  <th className="p-4 text-left font-medium">Last Active</th>
                  <th className="p-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {conversations.map((conv) => (
                  <tr key={conv.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <Link
                        href={`/project/${params.projectId}/chat/${conv.id}`}
                        className="flex items-center gap-2 hover:underline"
                      >
                        <span className="font-medium">{conv.title}</span>
                      </Link>
                    </td>
                    <td className="p-4">{conv.messages}</td>
                    <td className="p-4">{format(conv.created, "MMM d, yyyy")}</td>
                    <td className="p-4">{conv.lastActive}</td>
                    <td className="p-4 text-right">
                      <ConversationActions chatId={conv.id} projectId={params.projectId} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="divide-y md:hidden">
            {conversations.map((conv) => (
              <div key={conv.id} className="space-y-2 p-4">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/project/${params.projectId}/chat/${conv.id}`}
                    className="flex items-center gap-2 hover:underline"
                  >
                    <span className="font-medium">{conv.title}</span>
                  </Link>
                  <ConversationActions chatId={conv.id} projectId={params.projectId} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div>Messages: {conv.messages}</div>
                  <div>Created: {format(conv.created, "MMM d")}</div>
                  <div className="col-span-2">Last active: {conv.lastActive}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Conversation Actions Component
const ConversationActions = ({ chatId, projectId }: { chatId: string; projectId: string }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <MoreVertical className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem asChild>
        <Link href={`/project/${projectId}/chat/${chatId}`}>
          <FileText className="mr-2 h-4 w-4" /> View
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="text-destructive">
        <Trash2 className="mr-2 h-4 w-4" /> Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

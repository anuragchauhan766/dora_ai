import ProjectChat from "@/components/chat/projectChatpage";
import { db } from "@/db/database";
import { chats, messages } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export default async function ChatPage({ params }: { params: Promise<{ projectId: string; chatId: string }> }) {
  const { chatId } = await params;
  const chat = await db.query.chats.findFirst({
    where: eq(chats.id, chatId),
    with: {
      messages: {
        orderBy: [asc(messages.createdAt)],
      },
    },
  });

  return <ProjectChat id={chatId} chat={chat} />;
}

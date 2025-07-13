import { env } from "@/config/env/server";
import { db } from "@/db/database";
import { messages } from "@/db/schema";
import { chats } from "@/db/schema";
import { findRelevantContent } from "@/lib/ai";
import { systemPrompt } from "@/lib/prompt";
import { createAzure } from "@ai-sdk/azure";
import { auth } from "@clerk/nextjs/server";
import { Message, streamText, TextPart, tool } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
const azure = createAzure({
  resourceName: env.AZURE_RESOURCE_NAME,
  apiKey: env.AZURE_API_KEY,
  apiVersion: env.AZURE_OPENAI_API_VERSION,

});
export async function POST(req: Request) {
  const { messages: conversations, id, projectId, lastAiMessageId }: { messages: Message[]; id: string, projectId: string, lastAiMessageId: string } = await req.json();

  const { userId } = await auth();
  const result = streamText({
    model: azure(env.AZURE_OPENAI_API_DEPLOYMENT_NAME),
    system: systemPrompt(),
    messages: conversations,
    maxSteps: 10,
    onFinish: async ({ response }) => {
      await db.insert(chats).values({
        id,
        projectId: projectId,
        userId: userId,
      }).onConflictDoNothing({ target: chats.id });
      await db.insert(messages).values({
        id: conversations[conversations.length - 1].id,
        content: conversations[conversations.length - 1].content,
        role: "user",
        chatId: id,
      }).onConflictDoNothing({ target: messages.id })
      await db.insert(messages).values({
        id: lastAiMessageId || response.messages[response.messages.length - 1].id,
        content:
          (response.messages[response.messages.length - 1].content[0] as TextPart).text,
        role: "assistant",
        chatId: id,
      }).onConflictDoUpdate({
        target: messages.id,
        set: {
          content: (response.messages[response.messages.length - 1].content[0] as TextPart).text,
        },
      });
    },
    experimental_generateMessageId: () => crypto.randomUUID().toString(),
    tools: {

      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        parameters: z.object({
          question: z.string().describe('the users question'),
        }),
        execute: async ({ question }) => findRelevantContent(question),
      }),
    },
  });

  return result.toDataStreamResponse();
}

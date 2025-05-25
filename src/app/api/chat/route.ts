import { env } from "@/config/env/server";
import { findRelevantContent } from "@/lib/ai";
import { createAzure } from "@ai-sdk/azure";
import { streamText, tool } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
const azure = createAzure({
  resourceName: env.AZURE_RESOURCE_NAME,
  apiKey: env.AZURE_API_KEY,
  apiVersion: env.AZURE_OPENAI_API_VERSION,

});
export async function POST(req: Request) {
  const { messages } = await req.json(); 

  const result = streamText({
    // @ts-expect-error - TODO: fix this
    model: azure(env.AZURE_OPENAI_API_DEPLOYMENT_NAME),
    messages,
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

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    CLERK_SECRET_KEY: z.string().min(1),
    NODE_ENV: z.enum(["development", "test", "production"]),
    DATABASE_URL: z.string().min(1),
    CLERK_WEBHOOKS_SIGNING_SECRET: z.string().min(1),
    AZURE_RESOURCE_NAME: z.string().min(1),
    AZURE_API_KEY: z.string().min(1),
    AZURE_OPENAI_API_VERSION: z.string().min(1),
    AZURE_OPENAI_API_DEPLOYMENT_NAME: z.string().min(1),
    AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME: z.string().min(1),
    FIRECRAWL_API_KEY: z.string().min(1),
  },

  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  // runtimeEnv: {
  //   DATABASE_URL: process.env.DATABASE_URL,
  //   OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
  // },
  // For Next.js >= 13.4.4, you can just reference process.env:
  experimental__runtimeEnv: process.env,
});

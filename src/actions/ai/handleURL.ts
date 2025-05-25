"use server";

import { db } from "@/db/database";
import { documents, embeddings } from "@/db/schema";

import { AzureOpenAIEmbeddings } from "@langchain/openai";
import { eq } from "drizzle-orm";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { revalidatePath } from "next/cache";
import { chromium } from "playwright";
import { z } from "zod";
import "@mendable/firecrawl-js";
import { FireCrawlLoader } from "@langchain/community/document_loaders/web/firecrawl";
import { env } from "@/config/env/server";
const urlSchema = z.object({
  url: z.string().url(),
  projectId: z.string().uuid(),
  name: z.string().optional(),
});

export async function handleURL(data: FormData | { url: string; projectId: string, name: string }) {
  try {
    // Parse and validate input
    const { url, projectId, name } = urlSchema.parse(
      data instanceof FormData
        ? {
          url: data.get("url"),
          projectId: data.get("projectId"),
          name: data.get("name"),
        }
        : data
    );

    // Create initial document record
    const [document] = await db
      .insert(documents)
      .values({
        name: name || url,
        type: "link",
        content: "",
        url,
        fileSize: 0,
        projectId,
      })
      .returning();

    // Start processing in the background
    processDocument(document.id).catch(console.error);

    revalidatePath(`/${projectId}`);
    return { success: true, documentId: document.id, message: "URL added For Training" };
  } catch (error) {
    console.error("Error handling URL:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process URL",
    };
  }
}

async function processDocument(documentId: string) {
  const browser = await chromium.launch({
    headless: true,
  });

  try {
    // Get document
    const urlDoc = await db.query.documents.findFirst({
      where: eq(documents.id, documentId),
    });

    if (!urlDoc?.url) throw new Error("Document not found");

    // Update status
    await db.update(documents).set({ status: "processing", }).where(eq(documents.id, documentId));

    // Load content
    const loader = new FireCrawlLoader({
      url: urlDoc.url, // The URL to scrape
      apiKey: env.FIRECRAWL_API_KEY, // Optional, defaults to `FIRECRAWL_API_KEY` in your env.
      mode: "scrape", // The mode to run the crawler in. Can be "scrape" for single urls or "crawl" for all accessible subpages
      params: {
        // optional parameters based on Firecrawl API docs
        // For API documentation, visit https://docs.firecrawl.dev
      },
    });

    const docs = await loader.load();



    // Split content
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunks = await splitter.splitDocuments(docs);

    // Generate embeddings
    const embedder = new AzureOpenAIEmbeddings({
      azureOpenAIApiKey: env.AZURE_API_KEY,
      azureOpenAIApiInstanceName: env.AZURE_RESOURCE_NAME,
      azureOpenAIApiDeploymentName: env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
      azureOpenAIApiVersion: env.AZURE_OPENAI_API_VERSION,
    });
    const fullContent = docs.map((doc) => doc.pageContent).join("\n\n");
    const fileSize = Buffer.byteLength(fullContent, 'utf8');
    // Save everything
    await db.transaction(async (tx) => {
      await tx
        .update(documents)
        .set({
          content: fullContent,
          status: "completed",
          fileSize: fileSize,
          metadata: {
            ...docs[0].metadata,
          }
        })
        .where(eq(documents.id, documentId));
      const batchSize = 100;
      for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        const batchContents = batch.map(chunk => chunk.pageContent);
        const generatedEmbeddings = await embedder.embedDocuments(batchContents);

        await Promise.all(
          batch.map((chunk, index) =>
            tx.insert(embeddings).values({
              documentId,
              content: chunk.pageContent,
              embedding: generatedEmbeddings[index],
              chunkIndex: i + index,
              model: "text-embedding-ada-002",
              metadata: chunk.metadata,

            })
          )
        );
      }
      console.log("Embeddings saved");
    });
  } catch (error) {
    await db.update(documents).set({ status: "failed" }).where(eq(documents.id, documentId));

    throw error;
  } finally {
    await browser.close();
  }
}

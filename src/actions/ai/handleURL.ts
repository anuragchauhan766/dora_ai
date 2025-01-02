"use server";

import { documents, embeddings } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { PlaywrightWebBaseLoader } from "@langchain/community/document_loaders/web/playwright";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { AzureOpenAIEmbeddings } from "@langchain/openai";
import { chromium } from "playwright";
import { eq } from "drizzle-orm";
import { db } from "@/db/database";

const urlSchema = z.object({
  url: z.string().url(),
  projectId: z.string().uuid(),
});

export async function handleURL(data: FormData | { url: string; projectId: string }) {
  try {
    // Parse and validate input
    const { url, projectId } = urlSchema.parse(
      data instanceof FormData
        ? {
            url: data.get("url"),
            projectId: data.get("projectId"),
          }
        : data
    );

    // Create initial document record
    const [document] = await db
      .insert(documents)
      .values({
        name: new URL(url).hostname,
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
    return { success: true, documentId: document.id };
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
    const document = await db.query.documents.findFirst({
      where: eq(documents.id, documentId),
    });

    if (!document?.url) throw new Error("Document not found");

    // Update status
    await db.update(documents).set({ status: "processing" }).where(eq(documents.id, documentId));

    // Load content
    const loader = new PlaywrightWebBaseLoader(document.url, {
      launchOptions: {
        headless: true,
      },
      gotoOptions: {
        waitUntil: "networkidle",
        timeout: 60000,
      },
    });

    const [doc] = await loader.load();
    const content = doc.pageContent;

    // Split content
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunks = await splitter.splitText(content);

    // Generate embeddings
    const embedder = new AzureOpenAIEmbeddings();

    // Save everything
    await db.transaction(async (tx) => {
      await tx
        .update(documents)
        .set({
          content,
          status: "completed",
          fileSize: content.length,
        })
        .where(eq(documents.id, documentId));

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const [embedding] = await embedder.embedDocuments([chunk]);

        await tx.insert(embeddings).values({
          documentId,
          content: chunk,
          embedding,
          chunkIndex: i,
          model: "text-embedding-ada-002",
        });
      }
    });
  } catch (error) {
    await db.update(documents).set({ status: "failed" }).where(eq(documents.id, documentId));

    throw error;
  } finally {
    await browser.close();
  }
}

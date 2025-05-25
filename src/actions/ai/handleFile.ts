"use server";

import { db } from "@/db/database";
import { documents, embeddings } from "@/db/schema";
import { AzureOpenAIEmbeddings } from "@langchain/openai";
import { eq } from "drizzle-orm";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { env } from "@/config/env/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { Document } from "langchain/document";

const fileSchema = z.object({
    projectId: z.string().uuid(),
    files: z.array(z.instanceof(File)),
});

export async function handleFile(data: FormData) {
    try {
        const files = data.getAll("files") as File[];
        const projectId = data.get("projectId") as string;

        // Validate input
        fileSchema.parse({ projectId, files });

        const results = await Promise.all(
            files.map(async (file) => {
                // Create initial document record
                const [document] = await db
                    .insert(documents)
                    .values({
                        name: file.name,
                        type: getFileType(file.type),
                        content: "",
                        fileSize: file.size,
                        projectId,
                        url: "", // Required by schema but not used for files
                        mimeType: file.type,
                    })
                    .returning();

                // Start processing in the background
                processDocument(document.id, file).catch(console.error);

                return { success: true, documentId: document.id, message: "File added for processing" };
            })
        );

        revalidatePath(`/${projectId}`);
        return { success: true, results };
    } catch (error) {
        console.error("Error handling file upload:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to process files",
        };
    }
}

function getFileType(mimeType: string): "pdf" | "txt" | "csv" {
    switch (mimeType) {
        case "application/pdf":
            return "pdf";
        case "text/plain":
            return "txt";
        case "text/csv":
        case "application/csv":
            return "csv";
        default:
            throw new Error(`Unsupported file type: ${mimeType}`);
    }
}

async function processDocument(documentId: string, file: File) {
    try {
        // Get document
        const doc = await db.query.documents.findFirst({
            where: eq(documents.id, documentId),
        });

        if (!doc) throw new Error("Document not found");

        // Update status
        await db.update(documents).set({ status: "processing" }).where(eq(documents.id, documentId));

        // Load content based on file type
        let loader;
        const arrayBuffer = await file.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: file.type });

        switch (doc.type) {
            case "pdf":
                loader = new PDFLoader(blob, {
                    splitPages: false,
                });
                break;
            case "txt":
                loader = new TextLoader(blob);
                break;
            case "csv":
                loader = new CSVLoader(blob);
                break;
            default:
                throw new Error(`Unsupported file type: ${doc.type}`);
        }

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

        const fullContent = docs.map((doc: Document) => doc.pageContent).join("\n\n");

        // Save everything
        await db.transaction(async (tx) => {
            await tx
                .update(documents)
                .set({
                    content: fullContent,
                    status: "completed",
                    metadata: {
                        ...docs[0].metadata,
                    },
                })
                .where(eq(documents.id, documentId));

            const batchSize = 100;
            for (let i = 0; i < chunks.length; i += batchSize) {
                const batch = chunks.slice(i, i + batchSize);
                const batchContents = batch.map((chunk) => chunk.pageContent);
                const generatedEmbeddings = await embedder.embedDocuments(batchContents);

                await Promise.all(
                    batch.map((chunk, index) =>
                        tx.insert(embeddings).values({
                            documentId,
                            content: chunk.pageContent,
                            embedding: generatedEmbeddings[index],
                            chunkIndex: i + index,
                            model: env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
                            metadata: chunk.metadata,
                        })
                    )
                );
            }
            console.log("Embeddings saved");
        });
    } catch (error) {
        await db
            .update(documents)
            .set({ status: "failed", errorMessage: error instanceof Error ? error.message : "Unknown error" })
            .where(eq(documents.id, documentId));
        throw error;
    }
} 
"use server";
import { gt, desc, sql } from "drizzle-orm";

import { embeddings } from "@/db/schema";
import { cosineDistance } from "drizzle-orm";
import { db } from "@/db/database";
import { embed } from "ai";
import { env } from "@/config/env/server";
import { azure } from "@ai-sdk/azure";
const embeddingModel = azure.textEmbeddingModel(env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME);
export const generateEmbedding = async (value: string): Promise<number[]> => {
    const input = value.replaceAll('\\n', ' ');
    const { embedding } = await embed({
        model: embeddingModel,
        value: input,
    });
    return embedding;
};

export const findRelevantContent = async (userQuery: string) => {

    const userQueryEmbedded = await generateEmbedding(userQuery);
    const similarity = sql<number>`1 - (${cosineDistance(
        embeddings.embedding,
        userQueryEmbedded,
    )})`;
    const similarGuides = await db
        .select({ name: embeddings.content, similarity })
        .from(embeddings)
        .where(gt(similarity, 0.5))
        .orderBy(t => desc(t.similarity))
        .limit(4);
    return similarGuides;
};
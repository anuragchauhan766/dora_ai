"use server"
import { db } from "@/db/database";
import { documents, projects } from "@/db/schema";
import { formatErrorResponse, UnauthorizedError } from "@/lib/custom-errors";
import { auth } from "@clerk/nextjs/server";
import { eq, getTableColumns, sql } from "drizzle-orm";


export async function getProject() {
    try {
        const { userId } = await auth()
        if (!userId) {
            throw new UnauthorizedError('Please Sign In to create a project')
        }
        const data = await db.select({
            ...getTableColumns(projects),
            documentCounts: sql<number>`(
                    SELECT COUNT(*)::int 
                    FROM ${documents} 
                    WHERE ${documents.projectId} = ${projects.id}
                )`
        }).from(projects).where(eq(projects.userId, userId))
        return { success: true, data }
    } catch (error) {
        return formatErrorResponse(error)
    }
};

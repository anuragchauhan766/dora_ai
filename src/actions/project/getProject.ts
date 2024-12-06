"use server";
import { db } from "@/db/database";
import { documents, projects } from "@/db/schema";
import { UnauthorizedError } from "@/lib/custom-errors";
import { auth } from "@clerk/nextjs/server";
import { and, eq, getTableColumns, sql } from "drizzle-orm";

export async function getProjects() {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new UnauthorizedError("Please Sign In to create a project");
    }
    const data = await db
      .select({
        ...getTableColumns(projects),
        documentCounts: sql<number>`(
                    SELECT COUNT(*)::int 
                    FROM ${documents} 
                    WHERE ${documents.projectId} = ${projects.id}
                )`,
      })
      .from(projects)
      .where(eq(projects.userId, userId));
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getProject(projectId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new UnauthorizedError("Please Sign In to create a project");
    }
    const data = await db
      .select({
        ...getTableColumns(projects),
        documentCounts: sql<number>`(
                    SELECT COUNT(*)::int 
                    FROM ${documents} 
                    WHERE ${documents.projectId} = ${projects.id}
                )`,
      })
      .from(projects)
      .where(and(eq(projects.userId, userId), eq(projects.id, projectId)));
    return data[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

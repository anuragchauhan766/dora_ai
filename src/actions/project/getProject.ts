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
        documentCounts: sql<number>`COUNT(${documents.id})::int`,
      })
      .from(projects)
      .leftJoin(documents, eq(documents.projectId, projects.id))
      .where(eq(projects.userId, userId))
      .groupBy(projects.id);
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
        documentCounts: sql<number>`COUNT(${documents.id})::int`,
      })
      .from(projects)
      .leftJoin(documents, eq(documents.projectId, projects.id))
      .where(and(eq(projects.userId, userId), eq(projects.id, projectId)))
      .groupBy(projects.id);
    return data[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

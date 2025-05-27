"use server";
import { db } from "@/db/database";
import { projects } from "@/db/schema";
import { formatErrorResponse, UnauthorizedError } from "@/lib/custom-errors";
import { ApiResponse } from "@/types/api";
import { SelectProject } from "@/types/project";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateProject(
    projectId: string,
    data: Partial<Omit<SelectProject, "id" | "userId" | "createdAt" | "updatedAt">>
): Promise<ApiResponse<SelectProject>> {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new UnauthorizedError("Please Sign In to update a project");
        }

        const project = await db
            .update(projects)
            .set({ ...data, updatedAt: new Date() })
            .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
            .returning();

        if (!project[0]) {
            throw new Error("Project not found");
        }

        revalidatePath(`/project/${projectId}`);
        return { success: true, data: project[0] };
    } catch (error) {
        return formatErrorResponse(error);
    }
} 
"use server"
import { db } from "@/db/database";
import { projects } from "@/db/schema";
import { formatErrorResponse, UnauthorizedError } from "@/lib/custom-errors";
import { ApiResponse } from "@/types/api";
import { InsertProject, SelectProject } from "@/types/project";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";




export async function createProject(data: Omit<InsertProject, "userId">): Promise<ApiResponse<SelectProject>> {
    try {
        const { userId } = await auth()
        if (!userId) {
            throw new UnauthorizedError('Please Sign In to create a project')
        }
        const project = await db.insert(projects).values({ ...data, userId }).returning();
        revalidatePath('/dashboard')
        return { success: true, data: project[0] }
    } catch (error) {
        return formatErrorResponse(error)
    }

};

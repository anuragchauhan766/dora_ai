"use server";
import { db } from "@/db/database";
import { projects } from "@/db/schema";
import { formatErrorResponse, UnauthorizedError } from "@/lib/custom-errors";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteProject(id: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new UnauthorizedError("Please Sign In to create a project");
    }
    await db.delete(projects).where(eq(projects.id, id));
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return formatErrorResponse(error);
  }
}

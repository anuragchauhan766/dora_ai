import { getProject } from "@/actions/project/getProject";
import { redirect } from "next/navigation";

export default async function ProjectDetail({ params }: { params: { projectId: string } }) {
  const project = await getProject(params.projectId);
  if (!project) {
    return redirect("/dashboard");
  }
}

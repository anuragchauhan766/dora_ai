import { getProject } from "@/actions/project/getProject";
import { redirect } from "next/navigation";

export default async function ProjectDetail(props: { params: Promise<{ projectId: string }> }) {
  const params = await props.params;
  const project = await getProject(params.projectId);
  if (!project) {
    return redirect("/dashboard");
  }
}

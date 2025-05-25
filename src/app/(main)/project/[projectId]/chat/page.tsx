import { redirect } from "next/navigation";

export default async function ProjectChat({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const id = crypto.randomUUID().toString();

  redirect(`/project/${projectId}/chat/${id}`);
}

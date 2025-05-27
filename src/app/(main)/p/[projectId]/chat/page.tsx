import { redirect } from "next/navigation";

export default async function ProjectPublicChat({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const id = crypto.randomUUID().toString();

  redirect(`/p/${projectId}/chat/${id}`);
}

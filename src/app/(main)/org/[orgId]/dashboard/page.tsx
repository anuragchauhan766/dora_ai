import { getProjects } from "@/actions/project/getProject";
import { DashboardClient } from "@/components/dashboard/Dashboard";

export default async function Dashboard() {
  const projects = await getProjects();
  console.log(projects);
  if (!projects) {
    return null;
  }

  return <DashboardClient initialData={projects} />;
}

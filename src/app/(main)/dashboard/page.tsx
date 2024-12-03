import { getProject } from "@/actions/project/getProject";
import { DashboardClient } from "@/components/dashboard/Dashboard";

export default async function Dashboard() {
  const res = await getProject();
  if (!res.success) {
    console.error(res);
    return null;
  }

  return <DashboardClient initialData={res.data} />;
}

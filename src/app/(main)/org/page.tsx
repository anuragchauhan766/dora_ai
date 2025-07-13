import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function Page() {
  const { orgId } = await auth();
  if (!orgId) {
    return redirect("/org-selection");
  }
  return redirect(`/org/${orgId}/dashboard`);
}

export default Page;

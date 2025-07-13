"use client";

import { OrganizationList } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function OrganizationSelectionPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl") ?? "/";

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="flex w-full max-w-md flex-col items-center">
        <h1 className="text-foreground mb-8 text-center text-2xl font-bold sm:text-3xl">
          Select or Create your Organization
        </h1>
        <OrganizationList
          hidePersonal={true}
          afterCreateOrganizationUrl={redirectUrl}
          afterSelectOrganizationUrl={redirectUrl}
        />
      </div>
    </div>
  );
}

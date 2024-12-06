import ProjectNavar from "@/components/project/ProjectNavar";
import React from "react";

function ProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full">
      <ProjectNavar />

      {children}
    </div>
  );
}

export default ProjectLayout;

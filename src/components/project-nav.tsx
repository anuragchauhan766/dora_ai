import Link from "next/link";

// ... other imports

export function ProjectNav({ projectId }: { projectId: string }) {
  return (
    <nav className="flex space-x-4">
      <Link
        href={`/${projectId}/add-link`}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium"
      >
        Add Link
      </Link>
      {/* ... other nav items */}
    </nav>
  );
}

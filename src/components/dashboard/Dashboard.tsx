"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { ProjectWithDocCount } from "@/types/project";
import { KnowledgeBaseCard } from "./KnowledgeBaseCard";
import CreateKnowledgeBase from "./CreateKnowledgeBase";

interface DashboardClientProps {
  initialData: ProjectWithDocCount[];
}

export function DashboardClient({ initialData }: DashboardClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    return initialData.filter((kb) => kb.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [initialData, searchQuery]);

  return (
    <div className="container mx-auto h-full p-4">
      <h1 className="mb-6 text-3xl font-bold">Your Knowledgebases</h1>
      <div className="mb-6 flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search knowledgebases"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <CreateKnowledgeBase />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredData.map((kb) => (
          <KnowledgeBaseCard key={kb.id} data={kb} />
        ))}
      </div>
    </div>
  );
}

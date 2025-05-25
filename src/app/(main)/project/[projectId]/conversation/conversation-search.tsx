"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { useDebounce } from "@uidotdev/usehooks";

export function ConversationSearch({ projectId }: { projectId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Update URL when debounced search term changes
  useEffect(() => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (debouncedSearchTerm) {
        params.set("q", debouncedSearchTerm);
      } else {
        params.delete("q");
      }
      router.push(`/project/${projectId}/conversation?${params.toString()}`);
    });
  }, [debouncedSearchTerm, projectId, router, searchParams]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
      <Input
        placeholder="Search conversations..."
        className="pl-10"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}

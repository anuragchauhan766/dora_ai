"use client";

import { deleteProject } from "@/actions/project/deleteProject";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectWithDocCount } from "@/types/project";
import { Trash2 } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { toast } from "react-toastify";

interface KnowledgeBaseCardProps {
  data: ProjectWithDocCount;
}

export function KnowledgeBaseCard({ data }: KnowledgeBaseCardProps) {
  const handleDelete = async () => {
    toast.promise(deleteProject(data.id), {
      pending: "Deleting...",
      success: "Deleted successfully",
      error: "Something went wrong",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{data.name}</CardTitle>
        <CardDescription>
          {data.documentCounts} documents • Last updated: {moment(data.updatedAt).format("MMM D, YYYY")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{data.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href={`/project/${data.id}`}>View</Link>
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

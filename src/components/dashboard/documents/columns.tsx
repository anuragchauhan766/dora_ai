"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DocumentStatus } from "@/types/database";
import { Button } from "@/components/ui/button";
import { MoreVertical, File } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, ExternalLink, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export type Document = {
  id: string;
  name: string;
  type: string;
  fileSize: number;
  createdAt: Date;
  status: DocumentStatus | null;
};

export const columns: ColumnDef<Document>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <File className="h-4 w-4" />
          <span>{row.getValue("name")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      return <span className="capitalize">{row.getValue("type")}</span>;
    },
  },
  {
    accessorKey: "fileSize",
    header: "Size",
    cell: ({ row }) => {
      const size = row.getValue("fileSize") as number;
      return <span>{formatFileSize(size)}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Added",
    cell: ({ row }) => {
      return <span>{formatDate(row.getValue("createdAt"))}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as DocumentStatus | null;
      return <StatusBadge status={status || "pending"} />;
    },
  },
  {
    id: "actions",
    cell: ({}) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" /> Download
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ExternalLink className="mr-2 h-4 w-4" /> View
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const StatusBadge = ({ status }: { status: DocumentStatus }) => (
  <span
    className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
      status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
    }`}
  >
    {status}
  </span>
);

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

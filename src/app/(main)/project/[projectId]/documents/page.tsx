import { UploadDocuments } from "@/components/dashboard/UploadDocuments";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/db/database";
import { documents as documentsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { File, FileJson, FileText, Globe } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { columns, type Document } from "@/components/dashboard/documents/columns";

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
];

const typeOptions = [
  { label: "PDF", value: "pdf" },
  { label: "Link", value: "link" },
  { label: "Text", value: "txt" },
  { label: "CSV", value: "csv" },
  { label: "JSON", value: "json" },
];

const ProjectDocuments = async ({ params }: { params: Promise<{ projectId: string }> }) => {
  const { projectId } = await params;
  const docs = await db.query.documents.findMany({
    where: eq(documentsTable.projectId, projectId),
  });

  const documents: Document[] = docs.map((doc) => ({
    id: doc.id,
    name: doc.name,
    type: doc.type,
    fileSize: doc.fileSize,
    createdAt: doc.createdAt,
    status: doc.status,
  }));

  return (
    <div className="space-y-4 p-2 sm:space-y-6 sm:p-6">
      <UploadDocuments />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
        {[
          { icon: FileText, title: "Total", count: docs.length },
          { icon: File, title: "PDFs", count: docs.filter((doc) => doc.type === "pdf").length },
          { icon: Globe, title: "Links", count: docs.filter((doc) => doc.type === "link").length },
          {
            icon: FileJson,
            title: "Other",
            count: docs.filter((doc) => !["pdf", "link"].includes(doc.type)).length,
          },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium sm:text-sm">{stat.title}</p>
                  <p className="text-lg font-bold sm:text-2xl">{stat.count}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Documents Table */}
      <Card>
        <CardContent className="p-4">
          <DataTable
            columns={columns}
            data={documents}
            filterColumn="name"
            filterOptions={{
              status: statusOptions,
              type: typeOptions,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDocuments;

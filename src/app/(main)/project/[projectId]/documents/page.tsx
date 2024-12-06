import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UploadCloud,
  File,
  Link,
  Search,
  FileText,
  FileJson,
  Globe,
  Trash2,
  Download,
  ExternalLink,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ProjectDocuments = () => {
  return (
    <div className="space-y-4 p-2 sm:space-y-6 sm:p-6">
      {/* Header Actions - Stacked on mobile */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <Button className="flex-1 items-center gap-2 sm:flex-none">
            <UploadCloud className="h-4 w-4" />
            <span className="hidden sm:inline">Upload Files</span>
            <span className="sm:hidden">Upload</span>
          </Button>
          <Button variant="outline" className="flex-1 items-center gap-2 sm:flex-none">
            <Link className="h-4 w-4" />
            <span className="hidden sm:inline">Add URL</span>
            <span className="sm:hidden">URL</span>
          </Button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input placeholder="Search..." className="w-full pl-9" />
          </div>
        </div>
      </div>

      {/* Document Management Tabs - Scrollable on mobile */}
      <Tabs defaultValue="all" className="space-y-4">
        <div className="overflow-auto">
          <TabsList className="inline-flex min-w-full sm:min-w-0">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="urls">URLs</TabsTrigger>
            <TabsTrigger value="processed">Processed</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-4">
          {/* Stats Cards - Grid layout adjusts by screen size */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
            {[
              { icon: FileText, title: "Total", count: 24 },
              { icon: File, title: "PDFs", count: 12 },
              { icon: Globe, title: "URLs", count: 8 },
              { icon: FileJson, title: "Other", count: 4 },
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

          {/* Documents List - Table on desktop, Cards on mobile */}
          <div className="hidden sm:block">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="hidden md:table-cell">Size</TableHead>
                      <TableHead className="hidden md:table-cell">Added</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <File className="h-4 w-4" />
                            {doc.name}
                          </div>
                        </TableCell>
                        <TableCell>{doc.type}</TableCell>
                        <TableCell className="hidden md:table-cell">{doc.size}</TableCell>
                        <TableCell className="hidden md:table-cell">{doc.added}</TableCell>
                        <TableCell>
                          <StatusBadge status={doc.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <DocumentActions />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Document Cards */}
          <div className="space-y-2 sm:hidden">
            {documents.map((doc, i) => (
              <Card key={i}>
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <File className="h-4 w-4" />
                        <span className="font-medium">{doc.name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {doc.type} • {doc.size}
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={doc.status} />
                        <span className="text-xs text-muted-foreground">{doc.added}</span>
                      </div>
                    </div>
                    <DocumentActions />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper Components
const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
      status === "Processed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
    }`}
  >
    {status}
  </span>
);

const DocumentActions = () => (
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

// Sample data
const documents = [
  {
    name: "Product Specs.pdf",
    type: "PDF",
    size: "2.4 MB",
    added: "2h ago",
    status: "Processed",
  },
  {
    name: "Research Notes.txt",
    type: "Text",
    size: "145 KB",
    added: "5h ago",
    status: "Processed",
  },
  {
    name: "https://example.com/docs",
    type: "URL",
    size: "-",
    added: "1d ago",
    status: "Processing",
  },
];

export default ProjectDocuments;

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, CheckCircle2, Clock, FileText, RefreshCw, Settings2 } from "lucide-react";

const ProjectTraining = () => {
  return (
    <div className="space-y-4 p-2 sm:space-y-6 sm:p-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium sm:text-sm">Total Documents</p>
                <p className="text-lg font-bold sm:text-2xl">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs font-medium sm:text-sm">Processed</p>
                <p className="text-lg font-bold sm:text-2xl">20</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-xs font-medium sm:text-sm">Pending</p>
                <p className="text-lg font-bold sm:text-2xl">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-xs font-medium sm:text-sm">Failed</p>
                <p className="text-lg font-bold sm:text-2xl">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Processing Status */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-lg">
            Current Processing
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              <span className="hidden sm:inline">Embedding Settings</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>20/24 Documents</span>
              </div>
              <Progress value={83} />
            </div>

            {/* Current Document Progress - Only shows when processing */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing: Product Specs.pdf</span>
                <span>75%</span>
              </div>
              <Progress value={75} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing History */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Processing History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Processed At</TableHead>
                  <TableHead className="hidden md:table-cell">Duration</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processingHistory.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{item.processedAt}</TableCell>
                    <TableCell className="hidden md:table-cell">{item.duration}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="divide-y sm:hidden">
            {processingHistory.map((item, i) => (
              <div key={i} className="space-y-2 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.name}</span>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <StatusBadge status={item.status} />
                  <span className="text-muted-foreground">{item.processedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper Components
const StatusBadge = ({ status }) => {
  const styles = {
    completed: "bg-green-100 text-green-700",
    processing: "bg-yellow-100 text-yellow-700",
    failed: "bg-red-100 text-red-700",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Sample data
const processingHistory = [
  {
    name: "Product Specs.pdf",
    status: "completed",
    processedAt: "2024-12-06 14:30",
    duration: "45s",
  },
  {
    name: "Research Notes.txt",
    status: "processing",
    processedAt: "2024-12-06 14:25",
    duration: "30s",
  },
  {
    name: "Requirements.doc",
    status: "failed",
    processedAt: "2024-12-06 14:20",
    duration: "15s",
  },
];

export default ProjectTraining;

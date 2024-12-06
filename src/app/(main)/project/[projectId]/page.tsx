import { getProject } from "@/actions/project/getProject";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Binary, Clock, Files, MessageSquare, Zap } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProjectDetail({ params }: { params: { projectId: string } }) {
  const project = await getProject(params.projectId);
  if (!project) {
    return redirect("/dashboard");
  }
  return (
    <div className="space-y-6 p-6">
      {/* Quick Actions */}
      <div className="mb-8 flex flex-wrap gap-4">
        <Button className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Chat with AI
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Files className="h-4 w-4" />
          Add Document
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Binary className="h-4 w-4" />
          Train Model
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Chat Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+14% from last week</p>
          </CardContent>
        </Card>

        {/* Document Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <Files className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">12 PDF, 8 Text, 4 URLs</p>
          </CardContent>
        </Card>

        {/* Model Performance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Model Performance</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <Progress value={94} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Training Status */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions in your project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "2h ago", action: 'New document added: "Product Specs.pdf"' },
                { time: "4h ago", action: "Model training completed" },
                { time: "6h ago", action: "Chat session: 15 messages" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Training Status */}
        <Card>
          <CardHeader>
            <CardTitle>Training Status</CardTitle>
            <CardDescription>Model training progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex justify-between">
                  <span className="text-sm font-medium">Document Processing</span>
                  <span className="text-sm text-muted-foreground">100%</span>
                </div>
                <Progress value={100} />
              </div>
              <div>
                <div className="mb-2 flex justify-between">
                  <span className="text-sm font-medium">Model Training</span>
                  <span className="text-sm text-muted-foreground">78%</span>
                </div>
                <Progress value={78} />
              </div>
              <div>
                <div className="mb-2 flex justify-between">
                  <span className="text-sm font-medium">Fine-tuning</span>
                  <span className="text-sm text-muted-foreground">45%</span>
                </div>
                <Progress value={45} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

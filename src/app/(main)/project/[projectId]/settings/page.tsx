"use client";

import { deleteProject } from "@/actions/project/deleteProject";
import { getProject } from "@/actions/project/getProject";
import { updateProject } from "@/actions/project/updateProject";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Copy, RefreshCw, Save, Trash2, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ProjectWithDocCount } from "@/types/project";

const SettingsSkeleton = () => {
  return (
    <div className="space-y-4 p-2 sm:space-y-6 sm:p-6">
      <Tabs defaultValue="general" className="space-y-4">
        <div className="overflow-auto">
          <TabsList className="inline-flex min-w-full sm:min-w-0">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="ai">AI Settings</TabsTrigger>
            <TabsTrigger value="danger" className="text-destructive">
              Danger Zone
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>Basic settings for your project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-32 w-full" />
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-10 w-32" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>AI Configuration</CardTitle>
              <CardDescription>Configure AI behavior and responses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-32 w-full" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-10 w-20" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-10 w-20" />
                </div>
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-10 w-32" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="danger">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions for your project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2 rounded-lg border border-destructive/50 p-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-40" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ProjectSettings = () => {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<ProjectWithDocCount | null>(null);
  const [loading, setLoading] = useState(true);
  const [generalChanges, setGeneralChanges] = useState<Partial<ProjectWithDocCount>>({});
  const [aiChanges, setAiChanges] = useState<Partial<ProjectWithDocCount>>({});

  useEffect(() => {
    const fetchProject = async () => {
      const data = await getProject(params.projectId as string);
      if (data) {
        setProject(data);
      }
      setLoading(false);
    };
    fetchProject();
  }, [params.projectId]);

  const handleGeneralChange = (field: keyof ProjectWithDocCount, value: string) => {
    if (!project) return;
    setGeneralChanges((prev) => ({ ...prev, [field]: value }));
  };

  const handleAiChange = (field: keyof ProjectWithDocCount, value: string | number) => {
    if (!project) return;
    setAiChanges((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveGeneral = async () => {
    if (!project || Object.keys(generalChanges).length === 0) return;
    const res = await updateProject(project.id, generalChanges);
    if (res.success && "data" in res) {
      setProject({ ...res.data, documentCounts: project.documentCounts });
      setGeneralChanges({});
      toast.success("General settings updated successfully");
    } else if (!res.success && "error" in res) {
      toast.error(res.error.message);
    }
  };

  const handleSaveAi = async () => {
    if (!project || Object.keys(aiChanges).length === 0) return;
    const res = await updateProject(project.id, aiChanges);
    if (res.success && "data" in res) {
      setProject({ ...res.data, documentCounts: project.documentCounts });
      setAiChanges({});
      toast.success("AI settings updated successfully");
    } else if (!res.success && "error" in res) {
      toast.error(res.error.message);
    }
  };

  const handleDelete = async () => {
    if (!project) return;
    const res = await deleteProject(project.id);
    if (res.success) {
      toast.success("Project deleted successfully");
      router.push("/dashboard");
    } else if (!res.success && "error" in res) {
      toast.error(res.error.message);
    }
  };

  if (loading) {
    return <SettingsSkeleton />;
  }

  if (!project) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Project Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            The project you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
          </p>
          <Button className="mt-4" onClick={() => router.push("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-2 sm:space-y-6 sm:p-6">
      <Tabs defaultValue="general" className="space-y-4">
        <div className="overflow-auto">
          <TabsList className="inline-flex min-w-full sm:min-w-0">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="ai">AI Settings</TabsTrigger>
            <TabsTrigger value="danger" className="text-destructive">
              Danger Zone
            </TabsTrigger>
          </TabsList>
        </div>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>Basic settings for your project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Name</label>
                <Input
                  placeholder="My AI Project"
                  value={generalChanges.name ?? project.name}
                  onChange={(e) => handleGeneralChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Project description..."
                  value={generalChanges.description ?? project.description}
                  onChange={(e) => handleGeneralChange("description", e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveGeneral} disabled={Object.keys(generalChanges).length === 0}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Settings */}
        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>AI Configuration</CardTitle>
              <CardDescription>Configure AI behavior and responses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">System Prompt</label>
                <Textarea
                  placeholder="You are an AI assistant helping with..."
                  className="min-h-[100px]"
                  value={aiChanges.systemPrompt ?? project.systemPrompt ?? ""}
                  onChange={(e) => handleAiChange("systemPrompt", e.target.value)}
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Temperature</label>
                    <p className="text-sm text-muted-foreground">Controls randomness of responses (0-10)</p>
                  </div>
                  <Input
                    type="number"
                    className="w-20"
                    min={0}
                    max={10}
                    value={aiChanges.temperature ?? project.temperature ?? 7}
                    onChange={(e) => handleAiChange("temperature", parseInt(e.target.value))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Max Tokens</label>
                    <p className="text-sm text-muted-foreground">Maximum length of responses</p>
                  </div>
                  <Input
                    type="number"
                    className="w-20"
                    min={1}
                    value={aiChanges.maxTokens ?? project.maxTokens ?? 2000}
                    onChange={(e) => handleAiChange("maxTokens", parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveAi} disabled={Object.keys(aiChanges).length === 0}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Settings */}
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>Manage API keys and access settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">API Key</label>
                    <p className="text-sm text-muted-foreground">Use this key to access your project via API</p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button size="sm" variant="outline">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate
                    </Button>
                  </div>
                </div>
                <Input value="sk-..." type="password" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Allowed Origins</label>
                <Input placeholder="https://yourdomain.com" />
                <p className="text-sm text-muted-foreground">Enter domains that can access your API, one per line</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Settings */}
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>Manage team members and their access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {[
                  { name: "John Doe", email: "john@example.com", role: "Owner" },
                  { name: "Jane Smith", email: "jane@example.com", role: "Editor" },
                ].map((member, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border p-2">
                    <div className="space-y-1">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{member.role}</Badge>
                      {member.role !== "Owner" && (
                        <Button size="sm" variant="ghost" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full sm:w-auto">
                <Users className="mr-2 h-4 w-4" />
                Invite Team Member
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Danger Zone */}
        <TabsContent value="danger">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions for your project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2 rounded-lg border border-destructive/50 p-4">
                  <h4 className="font-medium">Delete Project</h4>
                  <p className="text-sm text-muted-foreground">
                    This action cannot be undone. All data will be permanently deleted.
                  </p>
                  <Button variant="destructive" className="mt-2" onClick={handleDelete}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Project
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectSettings;

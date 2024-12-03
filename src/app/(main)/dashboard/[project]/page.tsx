"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ProjectDetail({ params }: { params: { project: string } }) {
  const [documentContent, setDocumentContent] = useState("");
  const [link, setLink] = useState("");

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the document to your backend
    console.log("Adding document:", documentContent);
    setDocumentContent("");
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the link to your backend
    console.log("Adding link:", link);
    setLink("");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Project {params.project}</h1>
      <div className="mb-6">
        <Link href={`/dashboard/${params.project}/chat`}>
          <Button>Chat with AI</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-bold">Add Document</h2>
          <form onSubmit={handleAddDocument}>
            <div className="mb-4">
              <Label htmlFor="documentContent">Document Content</Label>
              <Textarea
                id="documentContent"
                value={documentContent}
                onChange={(e) => setDocumentContent(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Add Document</Button>
          </form>
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-bold">Add Link</h2>
          <form onSubmit={handleAddLink}>
            <div className="mb-4">
              <Label htmlFor="link">Link URL</Label>
              <Input id="link" type="url" value={link} onChange={(e) => setLink(e.target.value)} required />
            </div>
            <Button type="submit">Add Link</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

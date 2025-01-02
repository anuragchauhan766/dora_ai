"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UploadCloud, Link as LinkIcon } from "lucide-react";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";


export function UploadDocuments() {
  const [urlMode, setUrlMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleURLSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const url = formData.get("url") as string;
    const name = formData.get("name") as string;
    console.log(url, name);
    try {
    //   const result = await addURLAction({ url, name });
    //   if (result.success) {
    //     toast.success(result.message);
    //     (e.target as HTMLFormElement).reset();
    //   } else {
    //     toast.error(result.message);
    //   }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add URL");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    setIsSubmitting(true);
    const formData = new FormData();
    Array.from(e.target.files).forEach((file) => {
      formData.append("files", file);
    });

    try {
    //   const result = await uploadFilesAction(formData);
    //   if (result.success) {
    //     toast.success(result.message);
    //   } else {
    //     toast.error("Failed to upload files");
    //   }
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload files");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="mb-4 flex gap-4">
          <Button variant={urlMode ? "outline" : "default"} onClick={() => setUrlMode(false)} className="flex-1">
            <UploadCloud className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
          <Button variant={urlMode ? "default" : "outline"} onClick={() => setUrlMode(true)} className="flex-1">
            <LinkIcon className="mr-2 h-4 w-4" />
            Add URL
          </Button>
        </div>

        <div className={cn("space-y-4", !urlMode && "hidden")}>
          <form onSubmit={handleURLSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="url">URL</Label>
                <Input id="url" name="url" type="url" placeholder="https://example.com" required />
              </div>
              <div>
                <Label htmlFor="name">Display Name (Optional)</Label>
                <Input id="name" name="name" type="text" placeholder="My Document" />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Adding..." : "Add URL"}
              </Button>
            </div>
          </form>
        </div>

        <div className={cn("space-y-4", urlMode && "hidden")}>
          <div className="rounded-lg border-2 border-dashed p-6 text-center">
            <Input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={isSubmitting}
            />
            <Label htmlFor="file-upload" className="flex cursor-pointer flex-col items-center gap-2">
              <UploadCloud className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Drop files here or click to upload</span>
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

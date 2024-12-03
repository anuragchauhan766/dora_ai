"use client";

import { createProject } from "@/actions/project/createProject";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InsertProject } from "@/types/project";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
function CreateKnowledgeBase() {
  const [isOpen, setIsOpen] = useState(false);
  const [newKnowledgebaseName, setNewKnowledgebaseName] = useState<Pick<InsertProject, "name" | "description">>({
    name: "",
    description: "",
  });
  const handleCreateKnowledgebase = async () => {
    const res = await createProject({
      name: newKnowledgebaseName.name,
      description: newKnowledgebaseName.description,
    });
    if (res.success) {
      toast.success("Project Created Successfully");
      setNewKnowledgebaseName({
        name: "",
        description: "",
      });
      setIsOpen(false);
    } else {
      toast.error(res.error.message);
      setIsOpen(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={(e) => setIsOpen(e)}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create New Knowledgebase
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Knowledgebase</DialogTitle>
          <DialogDescription>Enter a name for your new knowledgebase.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-left">
              Name
            </Label>
            <Input
              id="name"
              value={newKnowledgebaseName.name}
              onChange={(e) =>
                setNewKnowledgebaseName((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-left">
              Description
            </Label>
            <Input
              id="name"
              value={newKnowledgebaseName.description}
              onChange={(e) =>
                setNewKnowledgebaseName((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreateKnowledgebase}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateKnowledgeBase;

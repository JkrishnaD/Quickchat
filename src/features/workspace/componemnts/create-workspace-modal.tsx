import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateWorkspaceModal } from "../store/use-create-workspace";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkspace } from "../api/use-create-workspace";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CreateWorkspaceModal = () => {
  const [open, setOpen] = useCreateWorkspaceModal();
  const [name, setName] = useState("");
  const router = useRouter();
  const { mutate, isPending } = useCreateWorkspace();

  const handleClose = () => {
    setOpen(false);
    setName("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      { name },
      {
        onSuccess(id) {
          toast.success("Workspace Created");
          console.log("successfully created", id);
          router.push(`/workspace/${id}`);
          handleClose();
        },
      }
    );
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="bg-white text-black">
          <DialogHeader>
            <DialogTitle>Add a Workspace</DialogTitle>
          </DialogHeader>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <Input
              disabled={isPending}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Workspace name e.g:'work','Home','Presonal'"
              autoFocus
              minLength={3}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isPending} variant="default">
                Create
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

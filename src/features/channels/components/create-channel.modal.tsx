"use client";
import { Input } from "@/components/ui/input";
import { useCreateChannelModal } from "../store/use-create-channel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCreateChannel } from "../api/use-create-channel";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const CreateChannelModal = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const [open, setOpen] = useCreateChannelModal();
  const [name, setName] = useState("");
  const { mutate, isPending } = useCreateChannel();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      { name, workspaceId },
      {
        onSuccess(id) {
          toast.success("Channel Created");
          router.push(`/workspace/${workspaceId}/channel/${id}`);
          handleClose();
        },
        onError() {
          toast.error("Failed to create");
        },
      }
    );
  };

  const handleClose = () => {
    setName("");
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setName(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black">
        <DialogHeader className="flex w-full items-center">
          <DialogTitle>Add a Channel</DialogTitle>
        </DialogHeader>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input
            disabled={isPending}
            required
            value={name}
            onChange={handleChange}
            placeholder="#  eg:doubts"
            autoFocus
            minLength={3}
            maxLength={30}
          />
          <p className="text-sm text-slate-600 font-medium">
            Channels are where all the conversations happen so choose name
            according to the conversation
          </p>
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending} variant="default">
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

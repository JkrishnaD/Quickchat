import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TrashIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

import { useRemoveWorkspace } from "@/features/workspace/api/use-remove-workspace";
import { useUpdateWorkspace } from "@/features/workspace/api/use-update-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useConfirm } from "@/hooks/use-confirm";

interface PreferenceModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
}

export const PreferenceModal = ({
  open,
  setOpen,
  initialValue,
}: PreferenceModalProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [ConfirmDoialog, confirm] = useConfirm(
    "Are You Sure!",
    "This Will Delete Workspace Permanently"
  );
  const [value, setValue] = useState(initialValue);
  const [editOpen, setEditOpen] = useState(false);

  const { mutate: updateWorkspace, isPending: isUpdatePending } =
    useUpdateWorkspace();
  const { mutate: removeWorkspace, isPending: isRemovePending } =
    useRemoveWorkspace();

  const handleRemove = async () => {
    const ok = await confirm();

    if (!ok) return null;

    removeWorkspace(
      {
        id: workspaceId,
      },
      {
        onSuccess: () => {
          toast.success("Workspace Deleted");
          router.replace("/");
        },
      }
    );
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateWorkspace(
      {
        id: workspaceId,
        name: value,
      },
      {
        onSuccess: () => {
          toast.success("Name Changed");
          setEditOpen(false);
        },
        onError: () => {
          setEditOpen(false);
          toast.error("Name Change Failed");
        },
      }
    );
  };

  return (
    <>
      <ConfirmDoialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-50 overflow-hidden p-0">
          <DialogHeader className="bg-white border-b p-5">
            <DialogTitle>{value}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col px-4 pb-4 gap-y-2">
            <div className="bg-white rounded-lg border px-5 py-4 cursor-pointer hover:bg-gray-50 transition">
              <div className="flex items-center justify-between w-full">
                <p className="font-semibold">workspace</p>
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                  <DialogTrigger>
                    <p className="font-semibold text-[#3758a5] hover:underline">
                      Edit
                    </p>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader className="flex items-center justify-center text-[#3758a5]">
                      <DialogTitle> Rename The Workspace</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-2" onSubmit={handleEdit}>
                      <Input
                        disabled={isUpdatePending}
                        placeholder="New Name"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        autoFocus
                        required
                      />
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button
                            variant="outline"
                            className="font-semibold text-[#3758a5]"
                            disabled={isUpdatePending}
                          >
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button
                          type="submit"
                          className="font-semibold bg-[#3758a5] hover:bg-[#3758a5]/90"
                          disabled={isUpdatePending}
                        >
                          Save
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-sm">{value}</p>
            </div>
            <Button
              disabled={isRemovePending}
              onClick={() => {
                handleRemove();
              }}
              className="flex items-center justify-start bg-white hover:bg-gray-50 cursor-pointer gap-x-1 px-3 py-4 rounded-lg border w-auto"
            >
              <TrashIcon color="red" className="size-5" />
              <p className="text-red-500 font-semibold text-sm">
                Delete Workspace
              </p>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

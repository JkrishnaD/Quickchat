import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRemoveChannel } from "@/features/channels/api/use-remove-channel ";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ChevronDown, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { memo, useState } from "react";
import { toast } from "sonner";
import { useCurrentMember } from "@/features/members/api/use-current-member";

interface HeaderProps {
  name: string;
}

export const Header = ({ name }: HeaderProps) => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const router = useRouter();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are You Sure!",
    "This Action will delete Channel Permanently"
  );

  const [editOpen, setEditOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const { data: member } = useCurrentMember({ workspaceId });
  const { mutate: updateChannel, isPending: updatePending } =
    useUpdateChannel();
  const { mutate: removeChannel, isPending: removePending } =
    useRemoveChannel();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setNewName(value);
  };

  const handleOpen = (value: boolean) => {
    if (member?.role !== "admin") return;
    setEditOpen(value);
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateChannel(
      {
        id: channelId,
        name: newName,
      },
      {
        onSuccess: () => {
          toast.success("Name Changed");
          setEditOpen(false);
        },
        onError: () => {
          setEditOpen(false);
          toast.error("Name-Change Failed");
        },
      }
    );
  };

  const handleRemove = async () => {
    const ok = await confirm();
    if (!ok) return null;

    removeChannel(
      { id: channelId },
      {
        onSuccess: () => {
          toast.success(`Channel "${name}" Deleted`);
          router.replace(`/workspace/${workspaceId}`);
        },
        onError() {
          toast.error("Failed to delete");
        },
      }
    );
  };

  return (
    <div className="flex h-[49px] border-b items-center px-4 overflow-hidden">
      <ConfirmDialog />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="font-bold text-base overflow-hidden w-auto"
          >
            # {name}
            <span className="truncate">
              <ChevronDown className="px-1 size-6.5" />
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0">
          <DialogHeader className="p-4 border-b font-bold text-lg">
            <DialogHeader># {name}</DialogHeader>
          </DialogHeader>
          <div className="px-4 pb-4 space-y-2">
            <div className="bg-white flex flex-col px-5 py-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex justify-between items-center w-full">
                {member?.role === "admin" ? (
                  <div>
                    <p className="font-bold text-base"> Change Name</p>
                    <p className="text-sm font-medium"># {name}</p>
                  </div>
                ) : (
                  <p className="font-bold text-base">
                    Only Admin can change the name
                  </p>
                )}
                <Dialog open={editOpen} onOpenChange={handleOpen}>
                  <DialogTrigger>
                    {member?.role === "admin" && (
                      <button className="font-bold text-[#3758a5] hover:underline">
                        Edit
                      </button>
                    )}
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader className="flex items-center font-bold text-[#3758a5]">
                      <DialogTitle>Rename the channel</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-2" onSubmit={handleEdit}>
                      <Input
                        placeholder="Change channel name"
                        value={newName}
                        autoFocus
                        required
                        onChange={handleChange}
                        disabled={updatePending}
                      />
                      <DialogFooter className="pt-2">
                        <DialogClose asChild>
                          <Button
                            variant="outline"
                            className="font-semibold text-[#3758a5]"
                            disabled={updatePending}
                          >
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button
                          type="submit"
                          className="font-semibold bg-[#3758a5]"
                          disabled={updatePending}
                        >
                          Save
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {member?.role === "admin" && (
              <button
                onClick={handleRemove}
                disabled={removePending}
                className="flex flex-row items-center border p-3 rounded-lg font-semibold text-red-500 hover:bg-gray-50"
              >
                <TrashIcon className="size-5 pr-1" /> Delete Channel
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

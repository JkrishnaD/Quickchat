import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateJoinCode } from "@/features/workspace/api/use-update-join-code";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Copy, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

interface InvitationModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}

export const InviteModal = ({
  open,
  setOpen,
  name,
  joinCode,
}: InvitationModalProps) => {
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useUpdateJoinCode();
  const [ConfirmDoialog, confirm] = useConfirm(
    "Are you sure?",
    "This action will leads to regenarating the invite code!"
  );
  const handleRegenerate = async () => {
    const ok = await confirm();
    if (!ok) return null;
    mutate(
      { workspaceId },
      {
        onSuccess: () => {
          toast.success("Invite Code Regenerated");
        },
        onError: () => {
          toast.error("Failed to regenarate the invite code");
        },
      }
    );
  };
  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success("Invite link copied to clipboard"));
  };

  return (
    <>
      <ConfirmDoialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader className="flex justify-center items-center space-y-2">
            <DialogTitle>Invite People to {name}</DialogTitle>
            <DialogDescription>
              You can use the below code to join/invite people into this
              workspace
            </DialogDescription>
            <DialogHeader className="flex flex-col justify-center items-center">
              <p className="font-bold text-4xl tracking-widest uppercase py-3">
                {joinCode}
              </p>
              <Button
                variant="ghost"
                className="gap-x-2 font-semibold"
                onClick={handleCopy}
              >
                Copy <Copy className="size-5" />
              </Button>
            </DialogHeader>
          </DialogHeader>
          <div className="flex flex-row justify-between">
            <Button
              disabled={isPending}
              variant="outline"
              className="font-semibold gap-x-1"
              onClick={handleRegenerate}
            >
              New Code <RefreshCcw className="size-4" />
            </Button>
            <DialogClose asChild>
              <Button className="font-semibold">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

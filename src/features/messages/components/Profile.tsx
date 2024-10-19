import {
  AlertTriangleIcon,
  ChevronDown,
  Loader,
  Mail,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useConfirm } from "@/hooks/use-confirm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetMember } from "@/features/members/api/use-get-member";
import { Id } from "../../../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { useRemoveMember } from "../api/use-delete-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileProps {
  memberId: Id<"members">;
  onClose: () => void;
}

export const Profile = ({ memberId, onClose }: ProfileProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [LeaveDialog, confirmLeave] = useConfirm(
    "Leave Workspace",
    "Are you sure, you want to leave this workspace"
  );

  const [RemoveDialog, confirmRemove] = useConfirm(
    "Remove from Workspace",
    "Are you sure, you want to remove this member"
  );

  const { data: currentMember, isLoading: isCurrentMemberLoading } =
    useCurrentMember({ workspaceId });

  const { data: member, isLoading: isMemberLoading } = useGetMember({
    id: memberId,
  });

  const { mutate: updateMember, isPending: isUpdateLoading } =
    useUpdateMember();
  const { mutate: removeMember, isPending: isRemovePending } =
    useRemoveMember();

  const avataFallback = member?.user.name?.charAt(0).toUpperCase();

  const onUpdate = async (role: "admin" | "member") => {
    updateMember(
      { role, id: memberId },
      {
        onSuccess: () => {
          toast.success("Role Changed");
        },
        onError: () => {
          toast.error("Failed to change role");
        },
      }
    );
  };

  const handleRemove = async () => {
    const ok = await confirmRemove();
    if (!ok) return null;

    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          toast.success("Removed Succesfully");
          onClose();
        },
        onError: () => {
          toast.error("Failed to remove");
        },
      }
    );
  };

  const handleLeave = async () => {
    const ok = await confirmLeave();
    if (!ok) return null;

    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          router.replace("/");
          toast.success("Left Succesfully");
          onClose();
        },
        onError: () => {
          toast.error("Failed to Leave");
        },
      }
    );
  };

  if (isMemberLoading || isCurrentMemberLoading) {
    return (
      <div className="flex h-full flex-col ">
        <div className="flex flex-row justify-between h-[49px] px-3 items-center border-b">
          <p className="font-bold text-lg">Profile</p>
          <button onClick={onClose}>
            <XIcon className="text-muted-foreground size-5" />
          </button>
        </div>
        <div className="flex justify-center items-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex flex-row justify-between h-[49px] px-3 items-center border-b">
          <p className="font-bold text-lg">Profile</p>
          <button onClick={onClose}>
            <XIcon className="text-muted-foreground size-5" />
          </button>
        </div>
        <div className="flex flex-col justify-center items-center h-full">
          <AlertTriangleIcon className="size-4 text-muted-foreground" />
          <p className="text-muted-foreground text-sm py-1">
            Member Not Found!!
          </p>
        </div>
      </div>
    );
  }
  return (
    <>
      <LeaveDialog />
      <RemoveDialog />
      <div className="flex h-full flex-col ">
        <div className="flex justify-between h-[49px] px-3 items-center border-b">
          <p className="font-bold text-lg">Profile</p>
          <button onClick={onClose}>
            <XIcon className="text-muted-foreground size-5" />
          </button>
        </div>
        <div className="flex flex-col items-center">
          <Avatar className="max-w-[250px] max-h-[250px] size-full p-4 rounded-none">
            <AvatarImage src={member.user.image} className="rounded-xl" />
            <AvatarFallback className="aspect-square rounded-xl text-6xl">
              {avataFallback}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col p-4">
          <p className="font-bold text-xl mb-3">{member.user.name}</p>
          <div className="flex flex-row mb-2 space-x-2">
            {currentMember?.role && currentMember._id !== member._id ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full capitalize items-center space-x-1"
                    >
                      {member.role} <ChevronDown className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuRadioGroup
                      value={member.role}
                      onValueChange={(role) =>
                        onUpdate(role as "admin" | "member")
                      }
                    >
                      <DropdownMenuRadioItem value="admin">
                        Admin
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="member">
                        Member
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  disabled={isRemovePending}
                  onClick={handleRemove}
                  className="w-full capitalize"
                >
                  Remove
                </Button>
              </>
            ) : currentMember?._id === member._id &&
              currentMember.role !== "admin" ? (
              <>
                <Button
                  onClick={handleLeave}
                  disabled={isRemovePending}
                  className="w-full capitalize"
                >
                  Leave
                </Button>
              </>
            ) : null}
          </div>
          <Separator />
          <div className="flex flex-col py-2 w-full">
            <h3 className="font-bold text-base mt-4">Contact Information</h3>
            <div className="flex my-2 gap-x-2 items-center mt-3 hover:bg-gray-50 py-2 rounded-md transition-all ease-in-out duration-100">
              <Mail className="bg-gray-50 size-9 p-2 rounded-md cursor-pointer" />
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-muted-foreground">
                  Email
                </p>
                <Link
                  href={`mailto:${member.user.email}`}
                  className="text-sky-500 text-xs hover:underline font-semibold"
                >
                  {member.user.email}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

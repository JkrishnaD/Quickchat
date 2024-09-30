"use client";

import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspace/api/use-get-workspac";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Loader, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

const WorkSpaceIdPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const [open, setOpen] = useCreateChannelModal();

  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });

  const { data: channels, isLoading: channelLoading } = useGetChannels({
    workspaceId,
  });
  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);
  const isAdmin = useMemo(() => member?.role === "admin", [member?.role]);

  useEffect(() => {
    if (workspaceLoading || channelLoading || !workspace || !workspace ) return;

    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!open && isAdmin) {
      setOpen(true);
    }
  }, [
    workspaceLoading,
    channelLoading,
    channelId,
    open,
    setOpen,
    router,
    workspace,
    workspaceId,
    isAdmin,
    member
  ]);

  if (workspaceLoading || channelLoading) {
    return (
      <div className="flex h-full justify-center items-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!workspace) {
    return (
      <div className="flex h-full justify-center items-center">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="font-semibold text-sm text-muted-foreground">
          Workspace Not found
        </span>
      </div>
    );
  }
  return (
    <div className="flex h-full justify-center items-center flex-col">
      <TriangleAlert className="size-6 text-muted-foreground" />
      <span className="font-semibold text-sm text-muted-foreground">
        Channel Not found
      </span>
    </div>
  );};

export default WorkSpaceIdPage;

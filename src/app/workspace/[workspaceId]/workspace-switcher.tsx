"use client";
import { Button } from "@/components/ui/button";
import { useGetWorkspace } from "@/features/workspace/api/use-get-workspac";
import { useGetWorkspaces } from "@/features/workspace/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/features/workspace/store/use-create-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Loader, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export const WorkspaceSwitcher = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const [_open, setOpen] = useCreateWorkspaceModal();

  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();

  const filterWorkspaces = workspaces?.filter((workspace) => {
    return workspace._id !== workspaceId;
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-9 relative overflow-hidden bg-accent/25 hover:bg-accent/40 font-semibold text-xl px-2">
          {workspaceLoading ? (
            <Loader className="animate-spin text-muted-foreground size-5 shrink-0" />
          ) : (
            workspace?.name.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
        className="w-64 bg-white text-[#153377] rounded-md my-2 z-10"
      >
        <DropdownMenuItem
          onClick={() => router.push(`/workspace/${workspaceId}`)}
          className="rounded-sm p-2  flex flex-col items-start justify-start font-semibold cursor-pointer capitalize"
        >
          {workspace?.name}
          <span className="text-xs capitalize">Active Workspace</span>
        </DropdownMenuItem>
        {filterWorkspaces?.map((workspace) => (
          <DropdownMenuItem
            key={workspace._id}
            onClick={() => router.push(`/workspace/${workspace._id}`)}
            className="cursor-pointer capitalize"
          >
            <div className="p-2 flex flex-row gap-2 items-center relative hover:bg-slate-200 overflow-hidden">
              <div className="text-xl font-semibold bg-[#153d99] p-1 px-2 rounded-md text-white">{workspace.name.charAt(0).toUpperCase()}</div>
              <div className="font-semibold flex flex-col truncate">{workspace.name}<span className="text-xs font-thin">Tap to change workspace</span></div>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          className="flex gap-2 p-2 font-semibold cursor-pointer items-center hover:bg-slate-200 hover:rounded-b-md"
          onClick={() => setOpen(true)}
        >
          <div className=" bg-[#153d99] p-1 rounded-md">
            <Plus color="white"/>
          </div>
          Add a workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

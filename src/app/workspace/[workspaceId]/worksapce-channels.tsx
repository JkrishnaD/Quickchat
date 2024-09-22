import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspace/api/use-get-workspac";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { AlertTriangle, Loader } from "lucide-react";
import { WorkspaceHeader } from "./workspace-header";

export const WorkspaceChannelsBar = () => {
  const workspaceId = useWorkspaceId();
  const { data: workspace, isLoading: worksapceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });

  if (worksapceLoading || memberLoading) {
    return (
      <div className="flex flex-col justify-center items-center bg-[#2f457a] h-full">
        <Loader className="animate-spin size-5 text-white " />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="flex flex-row justify-center items-center bg-[#2f457a] h-full gap-x-2">
        <AlertTriangle className="text-white" />
        <p className="text-white font-semibold">Workspaces not found</p>
      </div>
    );
  }
  return (
    <div className="bg-[#2f457a] h-full gap-x-2">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
    </div>
  );
};

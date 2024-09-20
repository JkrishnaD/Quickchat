"use client";

import { useGetWorkspace } from "@/features/workspace/api/use-get-workspac";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

const WorkSpaceIdPage = () => {
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetWorkspace({ id: workspaceId });

  return (
    <div>
      <p>{JSON.stringify(data)}</p>
      <p>Id:{workspaceId}</p>
    </div>
  );
};

export default WorkSpaceIdPage;

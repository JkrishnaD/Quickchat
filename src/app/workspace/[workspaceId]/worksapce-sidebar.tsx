import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspace/api/use-get-workspac";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetChannels } from "@/features/channels/api/use-get-channels";

import { AlertTriangle, Hash, Loader } from "lucide-react";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { WorkspaceSections } from "./channels-section";
import { WorkspaceHeader } from "./workspace-header";
import { SidebarItem } from "./sidebar-item";
import { UserItem } from "./user-item";

export const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();
  const { data: workspace, isLoading: worksapceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });
  const { data: members, isLoading: membersLoading } = useGetMembers({
    workspaceId,
  });

  if (worksapceLoading || memberLoading || channelsLoading) {
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
    <div className="bg-[#2f457a] h-full gap-x-1">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
      {/* <div className="flex flex-col"></div> */}

      <WorkspaceSections label="Channels" hint="New Channel" onNew={() => {}}>
        {channels?.map((item) => (
          <SidebarItem
            key={item._id}
            label={item.name}
            id={item._id}
            icon={Hash}
          />
        ))}
      </WorkspaceSections>
      <WorkspaceSections
        label="Direct Messages"
        hint="New Message"
        onNew={() => {}}
      >
        {members?.map((item) => (
          <UserItem
            key={item._id}
            id={item._id}
            image={item.user.image}
            label={item.user.name}
          />
        ))}
      </WorkspaceSections>
    </div>
  );
};

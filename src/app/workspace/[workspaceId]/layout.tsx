"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { Sidebar } from "./sidebar";
import { Toolbar } from "./toolbar";
import { usePanel } from "@/hooks/use-panel";

import { WorkspaceSidebar } from "./worksapce-sidebar";
import { Loader } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Thread } from "@/features/messages/components/Thread";
import { Profile } from "@/features/messages/components/Profile";

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}

const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
  const { parentMessageId, onCloseMessage, profileMemberId, onCloseProfile } =
    usePanel();

  const showPanel = !!parentMessageId || !!profileMemberId;

  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-47px)]">
        <Sidebar />
        <ResizablePanelGroup direction="horizontal" autoSaveId="jk-workspace">
          <ResizablePanel
            defaultSize={20}
            minSize={12}
            className="bg-[#2f457a]"
          >
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20}>{children}</ResizablePanel>
          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={29}>
                {parentMessageId ? (
                  <div className="h-full">
                    <Thread
                      messageId={parentMessageId as Id<"messages">}
                      onClose={onCloseMessage}
                    />
                  </div>
                ) : profileMemberId ? (
                  <div className="h-full">
                    <Profile
                      memberId={profileMemberId as Id<"members">}
                      onClose={onCloseProfile}
                    />
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkspaceIdLayout;

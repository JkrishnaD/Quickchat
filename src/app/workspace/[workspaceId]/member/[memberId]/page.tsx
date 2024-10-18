"use client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { AlertTriangle, Loader } from "lucide-react";
import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useCreateOrGetConversation } from "@/features/conversations/api/use-create-or-get-api";
import { Conversation } from "./conversation";

const MemberIdPage = () => {
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();
  const [conversationId, setConversationId] =
    useState<Id<"conversations"> | null>(null);

  const { mutate, isPending } = useCreateOrGetConversation();

  useEffect(() => {
    mutate(
      {
        workspaceId,
        memberId,
      },
      {
        onSuccess: (data) => {
          setConversationId(data);
        },
        onError: () => {
          toast.error("Failed to create or get conversation");
        },
      }
    );
  }, [mutate, workspaceId, memberId]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="text-muted-foreground size-5 animate-spin" />
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="flex items-center flex-col justify-center h-full gap-y-1">
        <AlertTriangle className="size-5 text-muted-foreground" />
        <span className="text-sm font-semibold text-muted-foreground">
          Conversation not found
        </span>
      </div>
    );
  }

  return <Conversation id={conversationId} />;
};

export default MemberIdPage;

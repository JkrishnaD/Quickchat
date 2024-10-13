import { AlertTriangleIcon, Loader, XIcon } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetMessage } from "../api/use-get-message";
import { Message } from "@/components/messages";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useState } from "react";

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const workspaceId = useWorkspaceId();
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const { data: member } = useCurrentMember({ workspaceId });
  const { data: message, isLoading: messageLoading } = useGetMessage({
    id: messageId,
  });

  if (messageLoading) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex flex-row justify-between h-[49px] px-3 items-center border-b">
          <p className="font-bold text-lg">Thread</p>
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

  if (!message) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex flex-row justify-between h-[49px] px-3 items-center border-b">
          <p className="font-bold text-lg">Thread</p>
          <button onClick={onClose}>
            <XIcon className="text-muted-foreground size-5" />
          </button>
        </div>
        <div className="flex flex-row justify-center items-center h-full">
          <AlertTriangleIcon className="size-4 text-muted-foreground" />
          <p className="text-muted-foreground text-sm pl-1">
            Message not found!!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-row justify-between h-[49px] px-3 items-center border-b">
        <p className="font-bold text-lg">Thread</p>
        <button onClick={onClose}>
          <XIcon className="text-muted-foreground size-5" />
        </button>
      </div>
      <div>
        <Message
          id={message._id}
          memberId={message.memberId}
          authorName={message.user.name}
          authorImage={message.user.image}
          isAuthor={member?._id === message.memberId}
          body={message.body}
          image={message.image}
          createdAt={message._creationTime}
          updatedAt={message.updatedAt}
          isEditing={editingId === message._id}
          setEditingId={setEditingId}
          hideThreadButton
        />
      </div>
    </div>
  );
};

import Quill from "quill";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { AlertTriangleIcon, Loader, XIcon } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetMessage } from "../api/use-get-message";
import { Message } from "@/components/messages";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useChannelId } from "@/hooks/use-channel-id";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { useCreateMessage } from "../api/use-create-message";
import { MessageList } from "@/components/message-list";
import { useGetMessages } from "../api/use-get-messages";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

type CreateMessageValues = {
  body: string;
  image: Id<"_storage"> | undefined;
  workspaceId: Id<"workspaces">;
  parentMessageId: Id<"messages">;
  channelId: Id<"channels">;
};

export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const editorRef = useRef<Quill | null>(null);

  const [editorKey, setEditorKey] = useState(0);

  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const { mutate: generateUrl, isPending: imageLoading } =
    useGenerateUploadUrl();
  const { mutate: createMessage, isPending: messagePending } =
    useCreateMessage();

  const { results, loadMore, status } = useGetMessages({
    channelId,
    parentMessageId: messageId,
  });
  const isLoadingMore = status === "LoadingMore";
  const canLoadMore = status === "CanLoadMore";

  const { data: member } = useCurrentMember({ workspaceId });
  const { data: message, isLoading: messageLoading } = useGetMessage({
    id: messageId,
  });

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image?: File | null;
  }) => {
    try {
      editorRef.current?.enable(false);

      const values: CreateMessageValues = {
        channelId,
        workspaceId,
        body,
        image: undefined,
        parentMessageId: messageId,
      };

      if (image) {
        const url = await generateUrl({}, { throwError: true });
        if (!url) {
          throw new Error("Url not found");
        }

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (!result.ok) {
          throw new Error("Url not Found");
        }
        const { storageId } = await result.json();

        values.image = storageId;
      }

      await createMessage(values, { throwError: true });

      setEditorKey((pervKey) => pervKey + 1);
    } catch (error) {
      toast.error("something went wrong!!");
    } finally {
      editorRef.current?.enable(true);
    }
  };

  if (messageLoading || status === "LoadingFirstPage") {
    return (
      <div className="flex h-full flex-col ">
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
    <div className="flex h-full flex-col ">
      <div className="flex justify-between h-[49px] px-3 items-center border-b">
        <p className="font-bold text-lg">Thread</p>
        <button onClick={onClose}>
          <XIcon className="text-muted-foreground size-5" />
        </button>
      </div>
      <div className="flex flex-col-reverse flex-1 pb-4 overflow-y-auto messages-scrollbar">
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
         <MessageList
          variant="thread"
          data={results}
          loadMore={loadMore}
          isLoadingMore={status === "LoadingMore"}
          canLoadMore={status === "CanLoadMore"}
        />
      </div>
      <div>
        {/* To auto load the messages */}
        <div
          className="h-1"
          ref={(el) => {
            if (el) {
              const observer = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting && canLoadMore) {
                    loadMore();
                  }
                },
                { threshold: 1.0 }
              );
              observer.observe(el);
              return () => observer.disconnect();
            }
          }}
        />
        {isLoadingMore && (
          <div className="text-center mr-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white text-xs px-4 py-1 rounded-full border border-gray-300 shadow-sm font-semibold">
              <Loader className="size-5 animate-spin text-muted-foreground" />
            </span>
          </div>
        )}
      </div>
      <div className="px-2 pb-1">
        <Editor
          key={editorKey}
          onSubmit={handleSubmit}
          placeholder="Reply...."
          disabled={messagePending || imageLoading}
          innerRef={editorRef}
        />
      </div>
    </div>
  );
};

import dynamic from "next/dynamic";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { format, isToday, isYesterday } from "date-fns";
import { Hint } from "./hint";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Thumbnail } from "./thumbnail";
import { Toolbar } from "./toolbar";
import { useUpdateMessage } from "@/features/messages/api/use-update-message";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRemoveMesssage } from "@/features/messages/api/use-delete-message";
import { useConfirm } from "@/hooks/use-confirm";
import { usePanel } from "@/hooks/use-panel";
import { ThreadBar } from "./thread-bar";

const MessageRenderer = dynamic(() => import("@/components/message-renderer"), {
  ssr: false,
});
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

const formatFullTime = (date: Date) => {
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d,yyyy")} at ${format(date, "h:mm:ss a")}`;
};

interface MessageProps {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorName?: string;
  isAuthor: boolean;
  authorImage?: string;
  //   reactions?: [];
  body: Doc<"messages">["body"];
  image: string | null | undefined;
  createdAt: Doc<"messages">["_creationTime"];
  updatedAt: Doc<"messages">["updatedAt"];
  threadName?: string;
  threadCount?: number;
  threadImage?: string;
  threadTimeStamp?: number;
  isEditing: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  isCompact?: boolean;
  hideThreadButton?: boolean;
}
export const Message = ({
  id,
  memberId,
  authorName,
  authorImage,
  isAuthor,
  body,
  image,
  createdAt,
  updatedAt,
  threadName,
  threadCount,
  threadImage,
  threadTimeStamp,
  isEditing,
  setEditingId,
  isCompact,
  hideThreadButton,
}: MessageProps) => {
  const {
    parentMessageId,
    onOpenMessage,
    onCloseMessage,
    profileMemberId,
    onCloseProfile,
    onOPenProfile,
  } = usePanel();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure!",
    "Once message deleted can't be restored"
  );

  const avatarFallback = authorName!.charAt(0).toUpperCase();
  const { mutate: updateMessage, isPending: isUpdatingMessage } =
    useUpdateMessage();
  const { mutate: removeMessage, isPending: isRemovingMessage } =
    useRemoveMesssage();

  const isPending = isUpdatingMessage || isRemovingMessage;

  const handleUpdate = ({ body }: { body: string }) => {
    updateMessage(
      { id, body },
      {
        onSuccess: () => {
          toast.success("Message Updated");
          setEditingId(null);
        },
        onError: () => {
          toast.error("Failed to update Message");
        },
      }
    );
  };

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    removeMessage(
      { id },
      {
        onSuccess: () => {
          toast.success("Message Deleted");
          if (parentMessageId === id) {
            onCloseMessage();
          }
        },
        onError: () => {
          toast.error("Failed to Delete");
        },
      }
    );
  };

  if (isCompact) {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            "flex flex-col px-5 hover:bg-gray-100 group relative items-start",
            isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
            isRemovingMessage &&
              "bg-rose-500 transform transition-all scale-y-0 origin-bottom duration-300"
          )}
        >
          {isEditing ? (
            <div className="w-full h-full">
              <Editor
                varient="update"
                onSubmit={handleUpdate}
                disabled={isPending}
                onCancel={() => setEditingId(null)}
                defaultValue={JSON.parse(body)}
              />
            </div>
          ) : (
            <div className="flex">
              <Hint label={formatFullTime(new Date(createdAt))}>
                <button className="text-[10px] group-hover:opacity-100 opacity-0 hover:underline text-muted-foreground font-semibold px-1">
                  {format(new Date(createdAt), "hh:mm")}
                </button>
              </Hint>
              <div className="flex flex-col w-fullpy-0.5">
                <MessageRenderer value={body} />
                <Thumbnail url={image} />
                {updatedAt ? (
                  <span className="text-xs text-muted-foreground">
                    (edited)
                  </span>
                ) : null}
                <ThreadBar
                  name={threadName}
                  count={threadCount}
                  image={threadImage}
                  timeStamp={threadTimeStamp}
                />
              </div>
            </div>
          )}
          {!isEditing && (
            <Toolbar
              isAuthor={isAuthor}
              isPending={isPending}
              handleEdit={() => setEditingId(id)}
              handleThread={() => onOpenMessage(id)}
              handleDelete={handleDelete}
              hideThreadButton={hideThreadButton}
              handleReaction={() => {}}
            />
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          "flex flex-col p-2 px-4 gap-2 hover:bg-gray-100 group relative",
          isEditing && "bg-[#4498f233] hover:bg-[#4498f233]",
          isRemovingMessage &&
            "bg-rose-500 transform transition-all scale-y-0 origin-bottom duration-300"
        )}
      >
        <div className="flex items-start">
          <button onClick={()=>onOPenProfile(memberId)}>
            <Avatar
              className="size-8 cursor-pointer hover:opacity-75 mr-1 "
            >
              <AvatarImage src={authorImage} />
              <AvatarFallback>
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </button>
          {isEditing ? (
            <div className="w-full h-full">
              <Editor
                varient="update"
                onSubmit={handleUpdate}
                disabled={isUpdatingMessage}
                onCancel={() => setEditingId(null)}
                defaultValue={JSON.parse(body)}
              />
            </div>
          ) : (
            <div className="flex flex-col w-full overflow-hidden ml-1">
              <div className="text-xs">
                <button
                  onClick={() => onOPenProfile(memberId)}
                  className="font-bold text-primary hover:underline"
                >
                  {authorName}
                </button>
                <span>&nbsp;&nbsp;</span>
                <Hint label={formatFullTime(new Date(createdAt))}>
                  <button className="hover:underline">
                    {format(new Date(createdAt), "h:mm a")}
                  </button>
                </Hint>
              </div>
              <MessageRenderer value={body} />
              <Thumbnail url={image} />
              {updatedAt ? (
                <span className="text-xs text-muted-foreground">(edited)</span>
              ) : null}
              <ThreadBar
                name={threadName}
                count={threadCount}
                image={threadImage}
                timeStamp={threadTimeStamp}
                onClick={() => onOpenMessage(id)}
              />
            </div>
          )}
        </div>
        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={isUpdatingMessage}
            handleEdit={() => setEditingId(id)}
            handleThread={() => onOpenMessage(id)}
            handleDelete={handleDelete}
            hideThreadButton={hideThreadButton}
            handleReaction={() => {}}
          />
        )}
      </div>
    </>
  );
};

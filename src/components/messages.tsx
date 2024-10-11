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

const MessageRenderer = dynamic(() => import("@/components/message-renderer"), {
  ssr: false,
});
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

const formatFullTime = (date: Date) => {
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d,yyyy")} at ${format(date, "h:mm:ss a")}`;
};

interface MessageProps {
  id: Id<"messages">;
  memberId?: Id<"members">;
  authorName?: string;
  isAuthor: boolean;
  authorImage?: string;
  //   reactions?: [];
  body: Doc<"messages">["body"];
  image: string | null | undefined;
  createdAt: Doc<"messages">["_creationTime"];
  updatedAt: Doc<"messages">["updatedAt"];
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
  threadCount,
  threadImage,
  threadTimeStamp,
  isEditing,
  setEditingId,
  isCompact,
  hideThreadButton,
}: MessageProps) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure!",
    "Once message deleted can't be restored"
  );

  const avatarFallback = authorName!.charAt(0).toUpperCase();
  const { mutate: updateMessage, isPending: isUpdatingMessage } =
    useUpdateMessage();
  const { mutate: removeMessage, isPending: isRemovingMessage } =
    useRemoveMesssage();

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
            "flex flex-col px-5 hover:bg-gray-50 group relative items-start",
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
                disabled={isUpdatingMessage}
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
              <div className="flex flex-col w-full items-center py-0.5">
                <MessageRenderer value={body} />
                <Thumbnail url={image} />
                {updatedAt ? (
                  <span className="text-xs text-muted-foreground">
                    (edited)
                  </span>
                ) : null}
              </div>
            </div>
          )}
          {!isEditing && (
            <Toolbar
              isAuthor={isAuthor}
              isPending={isUpdatingMessage}
              handleEdit={() => setEditingId(id)}
              handleThread={() => {}}
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
          "flex flex-col p-2 px-4 gap-2 hover:bg-gray-50 group relative",
          isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
          isRemovingMessage &&
            "bg-rose-500 transform transition-all scale-y-0 origin-bottom duration-300"
        )}
      >
        <div className="flex items-start">
          <button>
            <Avatar className="size-8 cursor-pointer hover:opacity-75 mr-1 ">
              <AvatarImage src={authorImage} />
              <AvatarFallback className="text-white font-bold bg-sky-500 text-lg ">
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
                  onClick={() => {}}
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
            </div>
          )}
        </div>
        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={isUpdatingMessage}
            handleEdit={() => setEditingId(id)}
            handleThread={() => {}}
            handleDelete={handleDelete}
            hideThreadButton={hideThreadButton}
            handleReaction={() => {}}
          />
        )}
      </div>
    </>
  );
};

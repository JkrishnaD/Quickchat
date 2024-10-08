import dynamic from "next/dynamic";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { format, isToday, isYesterday } from "date-fns";
import { Hint } from "./hint";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Thumbnail } from "./thumbnail";

const MessageRenderer = dynamic(() => import("@/components/message-renderer"), {
  ssr: false,
});

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
  setIsEditing?: (id: Id<"messages"> | null) => void;
  isCompact?: boolean;
  hideThreadButton?: boolean;
}
export const Message = ({
  id,
  memberId,
  authorName,
  authorImage,
  body,
  image,
  createdAt,
  updatedAt,
  threadCount,
  threadImage,
  threadTimeStamp,
  isEditing,
  setIsEditing,
  isCompact,
  hideThreadButton,
}: MessageProps) => {
  const avatarFallback = authorName!.charAt(0).toUpperCase();

  if (isCompact) {
    return (
      <div className="flex flex-col px-5 hover:bg-gray-50 group relative items-start">
        <div className="flex items-start">
          <Hint label={formatFullTime(new Date(createdAt))}>
            <button className="text-[10px] group-hover:opacity-100 opacity-0 hover:underline text-muted-foreground font-semibold px-1">
              {format(new Date(createdAt), "hh:mm")}
            </button>
          </Hint>
          <div className="flex flex-col w-full items-center py-0.5">
            <MessageRenderer value={body} />
            <Thumbnail url={image}/>
            {updatedAt ? (
              <span className="text-xs text-muted-foreground">(edited)</span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-2 px-4 gap-2 hover:bg-gray-50 group relative">
      <div className="flex items-start">
        <button>
          <Avatar className="size-8 cursor-pointer hover:opacity-75 mr-1 ">
            <AvatarImage src={authorImage} />
            <AvatarFallback className="text-white font-bold bg-sky-500 text-lg ">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </button>
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
          <Thumbnail url={image}/>
          {updatedAt ? (
            <span className="text-xs text-muted-foreground">(edited)</span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

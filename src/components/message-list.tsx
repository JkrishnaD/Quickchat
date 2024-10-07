import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { GetMessageReturnType } from "@/features/messages/use-get-messages";
import { Message } from "./messages";

const TIME_THRESHOLD = 5;

interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: "channel" | "thread" | "conversation";
  data: GetMessageReturnType;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}
const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d");
};

export const MessageList = ({
  memberName,
  memberImage,
  channelName,
  channelCreationTime,
  variant = "channel",
  data,
  loadMore,
  isLoadingMore,
  canLoadMore,
}: MessageListProps) => {
  const groupMessages = data?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, typeof data>
  );
  console.log(groupMessages);
  return (
    <div className="flex flex-col-reverse flex-1 pb-4 overflow-y-auto messages-scrollbar ">
      {Object.entries(groupMessages || {}).map(([dateKey, messages]) => (
        <div key={dateKey}>
          <div className="text-center mr-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white text-xs px-4 py-1 rounded-full border border-gray-300 shadow-sm font-semibold">
              {formatDateLabel(dateKey)}
            </span>
          </div>
          {messages.map((message, index) => {
            const prevMessage = messages[index - 1];
            const isCompact =
              prevMessage &&
              prevMessage.user?._id === message.user._id &&
              differenceInMinutes(
                new Date(message._creationTime),
                new Date(prevMessage._creationTime)
              ) < TIME_THRESHOLD;

            return (
              <Message
                key={index}
                id={message._id}
                body={message.body}
                image={message.image}
                memberId={message.memberId}
                authorName={message.user.name}
                isAuthor={false}
                authorImage={message.user.image}
                // reactions={message.reactions}
                createdAt={message._creationTime}
                updatedAt={message.updatedAt}
                threadCount={message.threadCount}
                threadImage={message.threadImage}
                threadTimeStamp={message.threadStamp}
                isEditing={false}
                setIsEditing={() => {}}
                hideThread={false}
                isCompact={isCompact}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

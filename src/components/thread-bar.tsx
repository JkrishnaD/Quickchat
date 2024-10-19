import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ChevronRight } from "lucide-react";

interface ThreadBarProps {
  name?: string;
  image?: string;
  count?: number;
  timeStamp?: number;
  onClick?: () => void;
}

export const ThreadBar = ({
  image,
  count,
  timeStamp,
  onClick,
  name="Member",
}: ThreadBarProps) => {
  const avatarFallback = name?.charAt(0).toUpperCase();

  if (!count || !timeStamp) {
    return null;
  }
  console.log(name)
  return (
    <button
      onClick={onClick}
      className="px-2 py-1 hover:bg-white border-transparent hover:border-border group/thread-bar flex items-center justify-start transition max-w-[600px] rounded-lg"
    >
      <div className="flex items-center gap-2 overflow-hidden w-full">
        <Avatar className="size-6 shrink-0">
          <AvatarImage src={image} />
          <AvatarFallback className="bg-sky-500 text-white font-semibold">{avatarFallback}</AvatarFallback>
        </Avatar>
        <span className="text-xs text-sky-700 hover:underline font-bold truncate">
          {count} {count > 1 ? "replies" : "reply"}
        </span>
        <span className="text-xs block group-hover/thread-bar:hidden truncate text-muted-foreground ">
          Last reply {formatDistanceToNow(timeStamp, { addSuffix: true })}
        </span>
        <span className="text-xs hidden group-hover/thread-bar:block truncate text-muted-foreground ">
          View Thread
        </span>
        <ChevronRight className="size-4 ml-auto opacity-0 group-hover/thread-bar:opacity-100 transition shrink-0 text-muted-foreground" />
      </div>
    </button>
  );
};

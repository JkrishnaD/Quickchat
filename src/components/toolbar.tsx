import { MessageSquareText, Pencil, Smile, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { EmojiPopover } from "./ui/emoji-popover";
import { Hint } from "./hint";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  isAuthor?: boolean;
  isPending: boolean;
  handleEdit?: () => void;
  handleThread?: () => void;
  handleDelete?: () => void;
  hideThreadButton?: boolean;
  handleReaction: (value: string) => void;
}

export const Toolbar = ({
  isAuthor,
  isPending,
  handleDelete,
  handleThread,
  handleEdit,
  hideThreadButton,
  handleReaction,
}: ToolbarProps) => {
  return (
    <div className="absolute top-0 right-5">
      <div className="group-hover:opacity-100 opacity-0 bg-white rounded-lg flex transition-opacity">
        <EmojiPopover
          onEmojiSelect={(emoji) => handleReaction(emoji.native)}
          hint="Add Reaction"
        >
          <Button variant="ghost" size="iconSm">
            <Smile className="size-4" />
          </Button>
        </EmojiPopover>
        {!hideThreadButton && (
          <Hint label="Reply in Thread">
            <Button variant="ghost" size="iconSm">
              <MessageSquareText className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <>
            <Hint label="Edit Message">
              <Button variant="ghost" size="iconSm">
                <Pencil className="size-4" />
              </Button>
            </Hint>
            <Hint label="Delete">
              <Button variant="ghost" size="iconSm">
                <Trash className="size-4" />
              </Button>
            </Hint>
          </>
        )}
      </div>
    </div>
  );
};
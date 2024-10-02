import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
interface EmojiPopoverProps {
  children: React.ReactNode;
  hint?: string;
  onEmojiSelect: (emoji: any) => void;
}

export const EmojiPopover = ({
  children,
  hint = "Emoji",
  onEmojiSelect,
}: EmojiPopoverProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const onSelect = (emoji: any) => {
    onEmojiSelect(emoji);
    setPopoverOpen(false);

    setTimeout(() => {// to avoid the bug
      setTooltipOpen(false);
    }, 500);
  };
  
  return (
    <div>
      <TooltipProvider>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <Tooltip
            open={tooltipOpen}
            onOpenChange={setTooltipOpen}
            delayDuration={100}
          >
            <PopoverTrigger asChild>
              <TooltipTrigger asChild>{children}</TooltipTrigger>
            </PopoverTrigger>
            <TooltipContent className="bg-black text-white border">
              <p className="font-semibold text-xs">{hint}</p>
            </TooltipContent>
          </Tooltip>
          <PopoverContent className="p-0 w-full border-none shadow-none rounded-xl">
            <Picker
              data={data}
              className="rounded-lg"
              onEmojiSelect={onSelect}
            />
          </PopoverContent>
        </Popover>
      </TooltipProvider>
    </div>
  );
};

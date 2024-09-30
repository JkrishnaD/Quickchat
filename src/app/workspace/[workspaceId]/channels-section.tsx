import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import React from "react";
import { FaCaretDown } from "react-icons/fa";
import { useToggle } from "react-use";

interface WorkspaceSections {
  children: React.ReactNode;
  label: string;
  hint: string;
  onNew?: () => void;
}

export const WorkspaceSections = ({
  children,
  label,
  hint,
  onNew,
}: WorkspaceSections) => {
  const [on, Toggle] = useToggle(true);

  return (
    <div className="flex flex-col px-5 py-2 space-y-1">
      <div className="flex items-center group">
        <Button
          variant="transperent"
          onClick={Toggle}
          className="shrink-0 p-0.5 h-[28px]"
        >
          <FaCaretDown
            className={cn(
              "size-5 transition-transform duration-500",
              on && "-rotate-180"
            )}
          />
        </Button>
        <Button
          variant="transperent"
          className="group px-1.5 overflow-hidden justify-start h-[28px] items-center"
        >
          <span className="font-semibold text-base truncate">{label}</span>
        </Button>
        {onNew && (
          <Hint label={hint} side="left" align="center">
            <Button
              onClick={onNew}
              variant="transperent"
              size="iconSm"
              className="opacity-0 group-hover:opacity-100 shrink-0 transition-opacity ml-auto text-sm p-0.5 size-6"
            >
              <Plus className="size-5" />
            </Button>
          </Hint>
        )}
      </div>
      {on && children}
    </div>
  );
};

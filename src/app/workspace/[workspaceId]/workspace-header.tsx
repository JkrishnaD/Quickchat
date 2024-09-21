import { Button } from "@/components/ui/button";
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Doc } from "../../../../convex/_generated/dataModel";
import { ChevronDown, ListFilter, SquarePen } from "lucide-react";
import { Hint } from "@/components/hint";

interface WorkspaceHeaderProps {
  workspace: Doc<"workspaces">;
  isAdmin: boolean;
}

export const WorkspaceHeader = ({
  workspace,
  isAdmin,
}: WorkspaceHeaderProps) => {
  return (
    <div className="flex items-center justify-between h-[49px] px-4 gap-0.5 w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="transperent"
            className="w-auto overflow-hidden font-semibold text-lg p-1.5 "
            size="sm"
          >
            <span className="truncate capitalize">{workspace.name}</span>
            <ChevronDown className="size-5 shrink-0 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom">
          <DropdownMenuItem className="cursor-pointer capitalize">
            <div className="text-xl font-semibold bg-[#153d99] p-1 px-2 rounded-md text-white mr-1 relative overflow-hidden">
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex justify-center flex-col px-2 relative truncate">
              <p className="font-semibold">{workspace.name}</p>
              <p className="font-thin text-xs text-muted-foreground">
                Active Workspace
              </p>
            </div>
          </DropdownMenuItem>
          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer py-2"
                onClick={() => {}}
              >
                Invite people to {workspace.name}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer py-2"
                onClick={() => {}}
              >
                Preferences
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex items-center gap-0.5">
        <Hint label="Filter Conversations" side="bottom">
          <Button variant="transperent" size="iconSm">
            <ListFilter color="white" className="size-5 cursor-pointer" />
          </Button>
        </Hint>
        <Hint label="Message" side="bottom">
          <Button variant="transperent" size="iconSm">
            <SquarePen color="white" className="size-5 cursor-pointer" />
          </Button>
        </Hint>
      </div>
    </div>
  );
};

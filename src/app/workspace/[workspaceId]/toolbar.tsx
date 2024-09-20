import { Button } from "@/components/ui/button";
import { useGetWorkspace } from "@/features/workspace/api/use-get-workspac";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Info, Search } from "lucide-react";

export const Toolbar = () => {
  const workspaceId = useWorkspaceId();
  const {data} = useGetWorkspace({id:workspaceId});

  return (
    <nav className="bg-[#153377] flex items-center justify-center h-12 p-1.5">
      <div className="flex-1" />
      <div className="w-min-[280px] w-max-[620px] grow-[2] shrink">
        <Button className="w-full flex justify-start items-center font-semibold gap-x-2 bg-accent/25 hover:bg-accent-20 h-8">
          <Search className="size-4" />
          <span className="text-xs">Search {data?.name}</span>
        </Button>
      </div>
      <div className="flex justify-end items-center flex-1 ml-auto">
        <Button variant="transperent" size="iconSm">
          <Info className="size-5" />
        </Button>
      </div>
    </nav>
  );
};

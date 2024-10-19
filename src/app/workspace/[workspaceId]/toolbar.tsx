import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetWorkspace } from "@/features/workspace/api/use-get-workspac";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Info, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export const Toolbar = () => {
  const [open, setOpen] = useState(false);
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace({ id: workspaceId });
  const { data: channels } = useGetChannels({ workspaceId });
  const { data: members } = useGetMembers({ workspaceId });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      document.addEventListener("keydown", down);
      return () => document.removeEventListener("keydown", down);
    };
  }, []);

  return (
    <nav className="bg-[#153377] flex items-center justify-center h-12 p-1.5">
      <div className="flex-1" />
      <div className="w-min-[280px] w-max-[620px] grow-[2] shrink">
        <Button
          className="w-full flex justify-start items-center font-semibold gap-x-2 bg-accent/25 hover:bg-accent-20 h-8"
          onClick={() => setOpen(true)}
        >
          <Search className="size-4" />
          <span className="text-xs">Search {data?.name}</span>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <Command>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandGroup heading="channels">
                {channels?.map((channel) => (
                  <CommandItem asChild>
                    <Link
                      href={`/workspace/${workspaceId}/channel/${channel._id}`}
                      onClick={() => setOpen(false)}
                    >
                      {channel.name}
                    </Link>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="members">
                {members?.map((member) => (
                  <CommandItem asChild>
                    <Link
                      href={`/workspace/${workspaceId}/member/${member._id}`}
                      onClick={() => setOpen(false)}
                    >
                      {member.user.name}
                    </Link>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </CommandDialog>
      </div>
      <div className="flex justify-end items-center flex-1 ml-auto">
        <Button variant="transperent" size="iconSm">
          <Info className="size-5" />
        </Button>
      </div>
    </nav>
  );
};

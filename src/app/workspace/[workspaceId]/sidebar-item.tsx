import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const SidebarItemVarients = cva(
  "flex items-center gap-1 justify-start font-semibold h-7 px-[18px] text-center text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-[#ffff]",
        active: "text-[#153377] bg-white/90 hover:bg-white/70",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface SidebarProps {
  label: string;
  id: string;
  icon: LucideIcon | IconType;
  variant?: VariantProps<typeof SidebarItemVarients>["variant"];
}

export const SidebarItem = ({
  label,
  id,
  icon: Icon,
  variant,
}: SidebarProps) => {
  const workspaceId = useWorkspaceId();

  return (
    <div>
      <Button
        asChild
        variant="transperent"
        size="sm"
        className={cn(SidebarItemVarients({ variant }))}
      >
        <Link
          href={`/workspace/${workspaceId}/channel/${id}`}
          className="space-x-1 font-semibold flex"
        >
          <Icon className="size-3.5 justify-start" />
          <span className="text-sm truncate capitalize">{label}</span>
        </Link>
      </Button>
    </div>
  );
};

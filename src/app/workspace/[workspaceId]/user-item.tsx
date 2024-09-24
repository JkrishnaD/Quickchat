import { cva, type VariantProps } from "class-variance-authority";
import { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

const UserItemVariants = cva(
  "flex items-center gap-1 justify-start font-semibold h-7 px-4 text-center text-sm overflow-hidden",
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

interface UserItemProps {
  id: Id<"members">;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof UserItemVariants>["variant"];
}
export const UserItem = ({ id, label, image, variant }: UserItemProps) => {
  const workspaceId = useWorkspaceId();
  const avatarFallback = label?.charAt(0).toUpperCase();
  return (
    <div>
      <Button
        variant="transperent"
        size="sm"
        className={cn(UserItemVariants({ variant: variant }))}
        asChild
      >
        <Link href={`/workspace/${workspaceId}/member/${id}`}>
          <Avatar className="size-5 rounded-full mr-1">
            <AvatarImage src={image} className="rounded-md" />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <span className="text-sm truncate">{label}</span>
        </Link>
      </Button>
    </div>
  );
};

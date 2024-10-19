import { useGetMember } from "@/features/members/api/use-get-member";
import { Id } from "../../../../convex/_generated/dataModel";
import { AlertTriangleIcon, Loader, Mail, XIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface ProfileProps {
  memberId: Id<"members">;
  onClose?: () => void;
}

export const Profile = ({ memberId, onClose }: ProfileProps) => {
  const { data: member, isLoading: memberLoading } = useGetMember({
    id: memberId,
  });
  const avataFallback = member?.user.name?.charAt(0).toUpperCase();

  if (memberLoading) {
    return (
      <div className="flex h-full flex-col ">
        <div className="flex flex-row justify-between h-[49px] px-3 items-center border-b">
          <p className="font-bold text-lg">Profile</p>
          <button onClick={onClose}>
            <XIcon className="text-muted-foreground size-5" />
          </button>
        </div>
        <div className="flex justify-center items-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex flex-row justify-between h-[49px] px-3 items-center border-b">
          <p className="font-bold text-lg">Profile</p>
          <button onClick={onClose}>
            <XIcon className="text-muted-foreground size-5" />
          </button>
        </div>
        <div className="flex flex-col justify-center items-center h-full">
          <AlertTriangleIcon className="size-4 text-muted-foreground" />
          <p className="text-muted-foreground text-sm py-1">
            Member Not Found!!
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col ">
      <div className="flex justify-between h-[49px] px-3 items-center border-b">
        <p className="font-bold text-lg">Profile</p>
        <button onClick={onClose}>
          <XIcon className="text-muted-foreground size-5" />
        </button>
      </div>
      <div className="flex flex-col items-center">
        <Avatar className="max-w-[250px] max-h-[250px] size-full p-4 rounded-none">
          <AvatarImage src={member.user.image} className="rounded-xl" />
          <AvatarFallback className="aspect-square rounded-xl text-6xl">
            {avataFallback}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col p-4">
        <p className="font-bold text-xl mb-4">{member.user.name}</p>
        <Separator />
        <div className="flex flex-col py-2">
          <h3 className="font-bold text-base ">Contact Information</h3>
          <div className="flex my-2 gap-x-2 items-center mt-3">
            <Mail className="bg-muted size-9 p-2 rounded-md cursor-pointer" />
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-muted-foreground">Email</p>
              <Link
                href={`mailto:${member.user.email}`}
                className="text-sky-500 text-xs hover:underline font-semibold"
              >
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

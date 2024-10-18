import { AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { FaChevronDown } from "react-icons/fa";

interface HeaderProps {
  memberName?: string;
  memberImage?: string;
  onClick?: () => void;
}

export const Header = ({
  memberImage,
  memberName = "member",
  onClick,
}: HeaderProps) => {
  const avatarFallback = memberName.charAt(0).toUpperCase();
  return (
    <div className="flex h-[49px] border-b items-center px-4 overflow-hidden">
      <Button
        variant="ghost"
        onClick={onClick}
        className="text-lg w-auto px-2 font-semibold overflow-hidden items-center"
      >
        <Avatar className="size-7 mr-1">
          <AvatarImage className="rounded-full" src={memberImage} />
          <AvatarFallback className="text-white bg-[#153377]">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span className="truncate">{memberName}</span>
        <FaChevronDown className="size-4 ml-2"/>
      </Button>
    </div>
  );
};

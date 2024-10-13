"use client";

import React from "react";
import { Tooltip, TooltipProvider } from "./ui/tooltip";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";

interface HintProps {
  label: string;
  children: React.ReactNode;
  side?: "right" | "left" | "top" | "bottom";
  align?: "start" | "center" | "end";
}

export const Hint = ({ label, children, side, align }: HintProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className="bg-black text-white border-white/5 p-2 rounded m-1 transition z-20"
        >
          <p className="font-semibold text-xs">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

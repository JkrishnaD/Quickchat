"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { Loader } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import VerificationInput from "react-verification-input";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useJoin } from "@/features/workspace/api/use-join";
import { useGetWorkspaceInfo } from "@/features/workspace/api/use-get-workspac-info";

const JoinPage = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });
  const { mutate, isPending } = useJoin();

  const isMember = useMemo(() => data?.isMember, [data?.isMember]);

  useEffect(() => {
    if (isMember) {
      router.push(`/workspace/${workspaceId}`);
    }
  }, [data?.isMember, router, workspaceId ,isMember]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader className="animate-spin text-muted-foreground size-8" />
      </div>
    );
  }

  const handleComplete = (value: string) => {
    mutate(
      { workspaceId, joinCode: value },
      {
        onSuccess: () => {
          toast.success(`Joined ${data?.name} workspace`);
          router.replace(`/workspace/${workspaceId}`);
        },
        onError: () => {
          toast.error("Failed to join workspace");
        },
      }
    );
  };

  return (
    <div className="h-full flex flex-col justify-center items-center p-8 bg-white gap-y-3">
      <Image src="/hash.svg" alt="Hash Icon" width={60} height={60} />
      <div className="flex flex-col justify-center gap-y-3 items-center max-w-md px-2">
        <div className="flex flex-col justify-center items-center gap-y-2">
          <h1 className="font-bold text-2xl">Join {data?.name}</h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace join code
          </p>
        </div>
        <VerificationInput
          onComplete={handleComplete}
          autoFocus
          classNames={{
            container: cn(
              "flex gap-x-2",
              isPending && "opacity-50 cursor-not-allowed"
            ),
            character:
              "uppercase h-auto rounded-md border-gray-300 flex items-center justify-center font-semibold text-lg",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black",
            characterFilled: "bg-white text-black",
          }}
          length={6}
        />
      </div>
      <Button className="" variant="outline">
        <Link href="/">Back To Home</Link>
      </Button>
    </div>
  );
};

export default JoinPage;

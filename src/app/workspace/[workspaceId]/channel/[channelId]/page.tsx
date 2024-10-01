"use client";
import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { Loader, TriangleAlert } from "lucide-react";
import { Header } from "./header";

const ChannelPage = () => {
  const id = useChannelId();

  if (!id) {
    return null;
  }
  const { data, isLoading } = useGetChannel({ id });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!data) {
    return (
      <div className="flex justify-center items-center h-full flex-col text-muted-foreground">
        <TriangleAlert />
        <span>Channel not found</span>
      </div>
    );
  }
  return (
    <div>
      <div>
        <Header name={data.name} />
      </div>
    </div>
  );
};

export default ChannelPage;

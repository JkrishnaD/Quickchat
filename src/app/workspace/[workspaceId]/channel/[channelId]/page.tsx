"use client";
import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { Loader, TriangleAlert } from "lucide-react";
import { Header } from "./header";
import { ChartInput } from "./chat-input";

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
    <div className="flex flex-col h-full">
      <Header name={data.name} />
      <div className="flex-1"/>
        <ChartInput placeholder={`Message in #${data.name}`} />
    </div>
  );
};

export default ChannelPage;

"use client";
import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { Loader, TriangleAlert } from "lucide-react";
import { Header } from "./header";
import { ChartInput } from "./chat-input";
import { useGetMessage } from "@/features/messages/use-get-messages";

const ChannelPage = () => {
  const channelId = useChannelId();

  if (!channelId) {
    return null;
  }
  const { results } = useGetMessage({ channelId });
  console.log(results)
  const { data, isLoading } = useGetChannel({ id: channelId });

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
      <div className="flex-1 text-xs" >
        {JSON.stringify(results)}
      </div>
      <ChartInput placeholder={`Message in #${data.name}`} />
    </div>
  );
};

export default ChannelPage;

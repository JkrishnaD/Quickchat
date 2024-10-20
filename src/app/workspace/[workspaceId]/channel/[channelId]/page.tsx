"use client";
import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { Loader, TriangleAlert } from "lucide-react";
import { Header } from "./header";
import { ChartInput } from "./chat-input";

import { MessageList } from "@/components/message-list";
import { useGetMessages } from "@/features/messages/api/use-get-messages";


const ChannelPage = () => {
  const channelId = useChannelId();

  const { results, status, loadMore } = useGetMessages({ channelId });
  const { data: channelData, isLoading } = useGetChannel({ id: channelId });

  if (isLoading || status === "LoadingFirstPage") {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!channelData) {
    return (
      <div className="flex justify-center items-center h-full flex-col text-muted-foreground">
        <TriangleAlert />
        <span>Channel not found</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full">
      <Header name={channelData.name} />
      <MessageList
        channelName={channelData.name}
        channelCreationTime={channelData._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChartInput placeholder={`Message in #${channelData.name}`} />
    </div>
  );
};

export default ChannelPage;

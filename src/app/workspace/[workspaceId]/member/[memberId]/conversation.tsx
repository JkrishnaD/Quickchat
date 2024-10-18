import { useMemberId } from "@/hooks/use-member-id";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useGetMember } from "@/features/members/api/use-get-member";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { Loader } from "lucide-react";
import { Header } from "./header";
import { ChartInput } from "./chat-input";
import { MessageList } from "@/components/message-list";

interface ConversationProps {
  id: Id<"conversations">;
}

export const Conversation = ({ id }: ConversationProps) => {
  const memberId = useMemberId();
  const { data: member, isLoading: memberLoading } = useGetMember({
    id: memberId,
  });
  const { status, loadMore, results } = useGetMessages({ conversationId: id });

  if (memberLoading || status === "LoadingFirstPage") {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header memberName={member?.user.name} memberImage={member?.user.image} />
      <MessageList
        data={results}
        variant="conversation"
        memberName={member?.user.name}
        memberImage={member?.user.image}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChartInput
        placeholder={`Message ${member?.user.name}`}
        conversationId={id}
      />
    </div>
  );
};

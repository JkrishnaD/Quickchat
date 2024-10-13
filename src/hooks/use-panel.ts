import { useParentMessageId } from "@/features/messages/store/use-parent-message";

export const usePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessageId();

  const onOpenMessage = (messageId: string) => {
    setParentMessageId(messageId);
  };

  const onClose = () => {
    setParentMessageId(null);
  };

  return {
    parentMessageId,
    onOpenMessage,
    onClose,
  };
};

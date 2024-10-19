import { useParentMessageId } from "@/features/messages/store/use-parent-message";
import { useProfileMemberId } from "@/features/messages/store/use-profile-member-id";

export const usePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessageId();
  const [profileMemberId, setProfileMemberId] = useProfileMemberId();

  const onOPenProfile = (memberId: string) => {
    setProfileMemberId(memberId);
    setParentMessageId(null);
  };

  const onOpenMessage = (messageId: string) => {
    setParentMessageId(messageId);
    setProfileMemberId(null);
  };

  const onCloseProfile = () => {
    setProfileMemberId(null);
  };
  const onCloseMessage = () => {
    setParentMessageId(null);
  };

  return {
    parentMessageId,
    onOpenMessage,
    onCloseMessage,
    onOPenProfile,
    onCloseProfile,
    profileMemberId,
  };
};

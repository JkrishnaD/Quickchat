import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { generateUploadUrl } from "../../../../../../convex/upload";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChartInputProps {
  placeholder: string;
}

type CreateMessageValues = {
  body: string;
  image?: Id<"_storage">;
  workspaceId: Id<"workspaces">;
  channelId: Id<"channels">;
};

export const ChartInput = ({ placeholder }: ChartInputProps) => {
  const [editorKey, setEditorKey] = useState(0);

  const editorRef = useRef<Quill | null>(null);

  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const { mutate: generateUrl } = useGenerateUploadUrl();
  const { mutate: createMessage, isPending: messagePending } =
    useCreateMessage();

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      editorRef.current?.enable(false);

      const values: CreateMessageValues = {
        channelId,
        workspaceId,
        body,
        image: undefined,
      };

      if (image) {
        const url = await generateUrl({}, { throwError: true });
        if (!url) {
          throw new Error("Url not found");
        }

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (!result.ok) {
          throw new Error("Url not Found");
        }
        const { storageId } = await result.json();

        values.image = storageId;
      }

      await createMessage(values, { throwError: true });

      setEditorKey((pervKey) => pervKey + 1);
    } catch (error) {
      toast.error("something went wrong!!");
    } finally {
      editorRef.current?.enable(true);
    }
  };

  return (
    <div className="px-4 pb-1 w-full">
      <Editor
        key={editorKey}
        onSubmit={handleSubmit}
        placeholder={placeholder}
        innerRef={editorRef}
        onCancel={() => {}}
        disabled={messagePending}
      />
    </div>
  );
};

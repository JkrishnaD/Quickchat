import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef } from "react";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });
interface ChartInputProps {
  placeholder: string;
}
export const ChartInput = ({placeholder}:ChartInputProps) => {
  const editorRef = useRef<Quill | null>(null);
  return (
    <div className="px-4 pb-1 w-full">
      <Editor

        onSubmit={() => {}}
        placeholder={placeholder}
        innerRef={editorRef}
        onCancel={() => {}}
        disabled={false}
      />
    </div>
  );
};

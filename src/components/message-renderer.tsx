import Quill from "quill";
import { useEffect, useRef, useState } from "react";

interface MessageRendererProps {
  value: string;
}
const MessageRenderer = ({ value }: MessageRendererProps) => {
  const [isEmpty, setIsEmpty] = useState(false);
  const renderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!renderRef.current) return;
    const container = renderRef.current;

    const quill = new Quill(document.createElement("div"), {
      theme: "snow",
    });
    quill.enable(false);

    const contents = JSON.parse(value);
    quill.setContents(contents);

    const isEmpty =
      quill
        .getText()
        .replace(/<(.|\n)*?>/g, "")
        .trim().length === 0;

    setIsEmpty(isEmpty);

    container.innerHTML = quill.root.innerHTML;
    return () => {
      container.innerHTML = "";
    };
  }, [value]);

  if (isEmpty) return null;

  return <div ref={renderRef} className="ql-editor-message ql-render" />;
};

export default MessageRenderer;

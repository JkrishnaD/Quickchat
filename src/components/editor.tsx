import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { PiTextAaBold } from "react-icons/pi";
import { MdSend } from "react-icons/md";

import Quill from "quill";
import "quill/dist/quill.snow.css";
import { Button } from "./ui/button";
import { ImageIcon, Smile, XIcon } from "lucide-react";
import { Hint } from "./hint";
import { Delta, Op } from "quill/core";
import { cn } from "@/lib/utils";
import { EmojiPopover } from "./ui/emoji-popover";
import Image from "next/image";

type EditorValue = {
  image?: File | null;
  body: string;
};

interface EditorProps {
  varient?: "create" | "update";
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  innerRef?: MutableRefObject<Quill | null>;
  disabled?: boolean;
}

//innerRef is prop is used to control the editor from outside the component

const Editor = ({
  varient = "create",
  onSubmit,
  onCancel,
  placeholder,
  defaultValue,
  innerRef,
  disabled = false,
}: EditorProps) => {
  const [text, setText] = useState("");
  const [isToggleVisible, setIsToggleVisible] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  //ref are great to use in the useEffect to avoid the rerenders
  const containerRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);
  const quillRef = useRef<Quill | null>(null);
  const imageElementRef = useRef<HTMLInputElement>(null);
  
  /*
  useLayoutEffect is simillar to useEffect but it prevents the rendering of the dom elements.
  it runs synchronously waits until to completes the actions and renders the page
  */

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  });

  //it first renders the page and perform the actions
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const quill = new Quill(editorContainer, {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "strike"],
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                const text = quill.getText();
                const addedImage = imageElementRef.current?.files?.[0] || null;

                const isEmpty =
                  !addedImage &&
                  text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

                if (isEmpty) return;
                const body = JSON.stringify(quill.getContents());
                submitRef.current?.({ body, image: addedImage });
              },
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n");
              },
            },
          },
        },
      },
    });

    quillRef.current = quill;
    quillRef.current.focus(); //auto focus to the text input area

    if (innerRef) {
      innerRef.current?.focus();
    }

    quill.setContents(defaultValueRef.current ?? []);
    setText(quill.getText()); //quill.getText gets the text from the text area and update constantly

    //to detect the text change in the text area
    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    //to clean the ref once the event is completed
    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = "";
      }
      if (quillRef) {
        quillRef.current = null;
      }
      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [innerRef]);

  const handleToggle = () => {
    setIsToggleVisible((current) => !current);
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");

    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden");
    }
  };

  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  //to add the emojio to the text
  const onEmojiSelect = (emoji: any) => {
    const quill = quillRef.current;
    quill?.insertText(quill.getSelection()?.index || 0, emoji.native);
  };

  return (
    <div className="flex flex-col">
      <input
        type="file"
        ref={imageElementRef}
        onChange={(e) => setImage(e.target.files![0])}
        className="hidden"
      />
      <div
        className={cn(
          "flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm bg-white transition",
          disabled && "opacity-50"
        )}
      >
        <div ref={containerRef} className="h-full ql-custom" />
        {!!image && (
          <div className="p-2">
            <div className="relative size-[100px] flex items-center justify-center group/image">
              <Hint label="Remove Image">
                <button
                  onClick={() => {
                    setImage(null);
                    imageElementRef.current!.value = "";
                  }}
                  className="hidden group-hover/image:flex items-center justify-center absolute -top-2.5 -right-2.5 bg-black/70 hover:bg-black text-white z-[4] rounded-full size-6 p-1"
                >
                  <XIcon />
                </button>
              </Hint>
              <Image
                src={URL.createObjectURL(image)}
                alt="Image"
                fill
                className="rounded overflow-hidden border object-cover"
              />
            </div>
          </div>
        )}
        <div className="px-2 pb-2 flex z-[5] gap-x-2">
          <Hint label={isToggleVisible ? "Show Formating" : "Hide Formating"}>
            <Button
              variant="ghost"
              size="iconSm"
              disabled={disabled}
              onClick={handleToggle}
            >
              <PiTextAaBold className="size-5" />
            </Button>
          </Hint>
          <EmojiPopover onEmojiSelect={onEmojiSelect}>
            <Button variant="ghost" size="iconSm" disabled={disabled}>
              <Smile className="size-5" />
            </Button>
          </EmojiPopover>
          {varient === "create" && (
            <Hint label="Add Image">
              <Button
                variant="ghost"
                size="iconSm"
                disabled={disabled}
                onClick={() => imageElementRef.current?.click()}
              >
                <ImageIcon className="size-5" />
              </Button>
            </Hint>
          )}
          {varient === "update" && (
            <div className="ml-auto space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                className="font-semibold"
              >
                Cancel
              </Button>
              <Button
                className="bg-[#007a5a] hover:bg-[#007a5a]/80 font-semibold"
                size="sm"
                disabled={disabled || isEmpty}
                onClick={()=> onSubmit({body:JSON.stringify(quillRef.current?.getContents())})}
              >
                Save
              </Button>
            </div>
          )}
          {varient === "create" && (
            <Button
              className={cn(
                "ml-auto",
                isEmpty
                  ? "bg-white text-muted-foreground"
                  : "bg-[#007a5a] hover:bg-[#007a5a]/80 "
              )}
              size="iconSm"
              disabled={disabled || isEmpty}
              onClick={() =>
                onSubmit({
                  body: JSON.stringify(quillRef.current?.getContents()),
                  image,
                })
              }
            >
              <MdSend className="size-5" />
            </Button>
          )}
        </div>
      </div>
      {varient === "create" && (
        <div className={cn("flex justify-end py-1", isEmpty && "opacity-0")}>
          <p className="text-xs text-muted-foreground font-bold">
            Shifht + Return to add a new line
          </p>
        </div>
      )}
    </div>
  );
};

export default Editor;

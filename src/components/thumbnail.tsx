
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

interface ThumbnailProps {
  url: string | null | undefined;
}
export const Thumbnail = ({ url }: ThumbnailProps) => {
  if (!url) return null;

  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative max-w-[320px] rounded-lg border overflow-hidden cursor-zoom-in my-2 ">
          <Image
            src={url}
            alt="Message Image"
            className="rounded-lg object-cover size-full"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="bg-transparent max-w-[800px] border-none p-0 shadow-none">
        <Image
          src={url}
          alt="Message Image"
          className="rounded-lg object-cover size-full"
        />
      </DialogContent>
    </Dialog>
  );
};

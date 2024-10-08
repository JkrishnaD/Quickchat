import { formatDate } from "date-fns";

interface ChannelHeroProps {
  name: string;
  createdAt: number;
}
export const ChannelHero = ({ name, createdAt }: ChannelHeroProps) => {
  return (
    <div className="flex flex-col mb-4 mx-5 tracking-normal mt-[84px]">
      <h1 className="font-bold text-lg"># {name}</h1>
      <p className="font-medium text-slate-900 gap-x-1">
        This channel was created on
        <span className="underline px-1">
          {formatDate(createdAt, "MMMM do,yyyy")}.
        </span>
        This is the very beginning of the channel 
        <strong className="underline px-1">#{name}</strong>
      </p>
    </div>
  );
};

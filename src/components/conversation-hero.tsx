import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ChannelHeroProps {
  name: string;
  image?: string;
}
export const ConversationHero = ({ name, image }: ChannelHeroProps) => {
  const avatarFallback = name.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col mb-1 mx-5 tracking-normal mt-[84px]">
      <div className="flex items-center space-x-2 py-1">
        <Avatar>
          <AvatarImage src={image} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <h1 className="font-bold text-lg">{name}</h1>
      </div>
      <p className="font-medium text-slate-900 gap-x-1">
        This was the conversation between you and 
        <strong className="px-1">{name}</strong>
      </p>
    </div>
  );
};

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface useGetChannelsProps {
  id: Id<"channels">;
}
//api to get thre datails of the single channel
export const useGetChannel = ({ id }: useGetChannelsProps) => {
  const data = useQuery(api.channels.getById, { id });
  const isLoading = data === undefined;

  return { data, isLoading };
};

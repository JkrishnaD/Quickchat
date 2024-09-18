import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export const useCurrentUser = () => {
  const data = useQuery(api.user.current);
  const isLoading = data === undefined;
  //Here if the data is undefined then data is not uploaded it is fetching.
  //So, it can be considered as loading state
  return { data, isLoading };
};

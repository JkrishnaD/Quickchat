import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export const useGetWorkspace = () => {
  const data = useQuery(api.workspace.get);
  const isLoading = data === undefined;

  return { data, isLoading };
};

import { Id } from "./../../../../convex/_generated/dataModel.d";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

interface UseGetMembersProps {
  workspaceId: Id<"workspaces">;
}

export const useGetMembers = ({ workspaceId }: UseGetMembersProps) => {
  const data = useQuery(api.member.get, { workspaceId });
  const isLoading = data === undefined;

  return { data, isLoading };
};

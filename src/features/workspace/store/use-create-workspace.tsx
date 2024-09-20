import { atom, useAtom } from "jotai";

const modalAtom = atom(false);

export const useCreateWorkspaceModal = () => {
  return useAtom(modalAtom);
};

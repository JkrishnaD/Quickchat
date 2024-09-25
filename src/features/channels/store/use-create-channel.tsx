import { atom, useAtom } from "jotai";

const modalAtom = atom(false);

export const useCreateChannelModal = () => {
  return useAtom(modalAtom);
};

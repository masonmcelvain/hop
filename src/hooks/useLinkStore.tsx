import { addLink, AddLinkData } from "@lib/links";
import { LinkState } from "@models/link-state";
import create from "zustand/react";

interface LinkStore extends LinkState {
  addLink: (link: AddLinkData) => void;
  setLinks: (links: LinkState) => void;
}

export const useLinkStore = create<LinkStore>()((set) => ({
  linkKeys: [],
  links: [],
  nextLinkId: 0,
  addLink: (link: AddLinkData) => set((state) => addLink(state, link)),
  setLinks: (links: LinkState) => set(() => links),
}));

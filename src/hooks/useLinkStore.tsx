import { addLink, AddLinkData, updateLink, UpdateLinkData } from "@lib/links";
import { LinkState } from "@models/link-state";
import create from "zustand/react";

interface LinkStore extends LinkState {
  addLink: (link: AddLinkData) => void;
  setLinks: (links: LinkState) => void;
  updateLink: (links: UpdateLinkData) => void;
}

export const useLinkStore = create<LinkStore>()((set) => ({
  linkKeys: [],
  links: [],
  nextLinkId: 0,
  addLink: (link: AddLinkData) => set((state) => addLink(state, link)),
  setLinks: (links: LinkState) => set(() => links),
  updateLink: (link: UpdateLinkData) => set((state) => updateLink(state, link)),
}));

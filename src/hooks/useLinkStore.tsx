import {
  addLink,
  AddLinkData,
  deleteLink,
  reorderLinks,
  ReorderLinksData,
  updateLink,
  UpdateLinkData,
} from "@lib/links";
import { LinkState } from "@models/link-state";
import create from "zustand";

interface LinkStore extends LinkState {
  addLink: (link: AddLinkData) => void;
  deleteLink: (linkKeyId: number) => void;
  reorderLinks: (data: ReorderLinksData) => void;
  setLinks: (links: LinkState) => void;
  updateLink: (links: UpdateLinkData) => void;
}

export const useLinkStore = create<LinkStore>()((set) => ({
  linkKeys: [],
  links: [],
  nextLinkId: 0,
  addLink: (link: AddLinkData) => set((state) => addLink(state, link)),
  deleteLink: (linkKeyId: number) =>
    set((state) => deleteLink(state, linkKeyId)),
  reorderLinks: (data: ReorderLinksData) =>
    set((state) => reorderLinks(state, data)),
  setLinks: (links: LinkState) => set(() => links),
  updateLink: (link: UpdateLinkData) => set((state) => updateLink(state, link)),
}));

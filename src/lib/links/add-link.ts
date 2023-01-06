import {
  getStorageKeyForLink,
  setNextStoredLinkId,
  setStoredLinksAndKeys,
} from "@lib/webextension";
import { LinkData, LinkState } from "@models/link-state";

export type AddLinkData = {
  name: string;
  url: string;
  imageUrl: string;
};

export function addLink(prevState: LinkState, payload: AddLinkData): LinkState {
  const { name, url, imageUrl } = payload;

  const currentLinkId = prevState.nextLinkId;
  const nextLinkId = currentLinkId + 1;

  const newLink: LinkData = {
    id: currentLinkId,
    name,
    url,
    imageUrl,
  };
  const newLinks = [...prevState.links, newLink];
  const newLinkKeys = [...prevState.linkKeys, getStorageKeyForLink(newLink)];

  setStoredLinksAndKeys(newLinks, newLinkKeys);
  setNextStoredLinkId(nextLinkId);
  return {
    ...prevState,
    linkKeys: newLinkKeys,
    links: newLinks,
    nextLinkId,
  };
}

import { getStorageKeyForLink, setStoredLinksAndKeys } from "@lib/webextension";
import { LinkState } from "@models/link-state";

export function deleteLink(
  prevState: LinkState,
  linkKeyIndex: number
): LinkState {
  const newLinkKeys = [...prevState.linkKeys];
  const [deletedLinkKey] = newLinkKeys.splice(linkKeyIndex, 1);

  const newLinks = prevState.links.filter(
    (link) => deletedLinkKey !== getStorageKeyForLink(link)
  );

  setStoredLinksAndKeys(newLinks, newLinkKeys);
  return {
    ...prevState,
    linkKeys: newLinkKeys,
    links: newLinks,
  };
}

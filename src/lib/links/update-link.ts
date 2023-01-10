import { setStoredLinks } from "@lib/webextension";
import { LinkData, LinkState } from "@models/link-state";

export type UpdateLinkData = {
  id: number;
  name: string;
  url: string;
  imageUrl: string;
};

export function updateLink(
  prevState: LinkState,
  data: UpdateLinkData
): LinkState {
  const { id, name, url, imageUrl } = data;

  const newLinks: LinkData[] = prevState.links.map((link) => {
    return link.id === id
      ? {
          id,
          name,
          url,
          imageUrl,
        }
      : link;
  });

  setStoredLinks(newLinks);
  return { ...prevState, links: newLinks };
}

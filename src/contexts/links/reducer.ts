import {
  getLinkIdForStorageKey,
  getStorageKeyForLink,
  setStoredLinks,
  setStoredLinksAndKeys,
} from "@lib/webextension";
import { LinkData, LinkState } from "@models/link-state";

export const Reducer = (
  state: LinkState,
  action: LinkActionTypes
): LinkState => {
  switch (action.type) {
    case LinkAction.UPDATE_LINK:
      return updateLink(state, action.payload);
    case LinkAction.REORDER_LINKS:
      return reorderLinks(state, action.payload);
    case LinkAction.DELETE_LINK:
      return deleteLink(state, action.payload);
  }
};

function updateLink(
  prevState: LinkState,
  payload: UpdateLinkPayload
): LinkState {
  const { id, name, url, imageUrl } = payload;
  const newLinks = modifyLink(prevState.links, id, () => ({
    id,
    name,
    url,
    imageUrl,
  }));

  setStoredLinks(newLinks);
  return { ...prevState, links: newLinks };
}

/**
 * The caller must save the links to local storage.
 */
function reorderLinks(
  prevState: LinkState,
  payload: ReorderLinksPayload
): LinkState {
  const { sourceId } = payload;
  let { newLinkKeyIndex } = payload;
  const newLinkKeys = [...prevState.linkKeys];

  const oldLinkKeyIndex = newLinkKeys.findIndex(
    (key) => getLinkIdForStorageKey(key) === sourceId
  );

  // If dropped in an empty cell, put the card at the end of the array
  if (newLinkKeyIndex >= newLinkKeys.length) {
    newLinkKeyIndex = newLinkKeys.length - 1;
  }

  if (oldLinkKeyIndex === newLinkKeyIndex) {
    // If there is no positional change, do nothing.
    return prevState;
  }

  const [linkKeyToMove] = newLinkKeys.splice(oldLinkKeyIndex, 1);
  newLinkKeys.splice(newLinkKeyIndex, 0, linkKeyToMove);

  // Don't store the new order, as this reordering may be temporary.
  return {
    ...prevState,
    linkKeys: newLinkKeys,
  };
}

function deleteLink(prevState: LinkState, linkKeyIndex: number): LinkState {
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

function modifyLink(
  prevLinks: LinkData[],
  linkId: number,
  callback: (link: LinkData) => LinkData
): LinkData[] {
  const newLinks = [...prevLinks];

  newLinks.forEach((link, i) => {
    if (link.id === linkId) {
      newLinks[i] = callback(link);
      return;
    }
  });

  return newLinks;
}

type UpdateLinkPayload = {
  id: number;
  name: string;
  url: string;
  imageUrl: string;
};
type UpdateLinkAction = {
  type: typeof LinkAction.UPDATE_LINK;
  payload: UpdateLinkPayload;
};

type ReorderLinksPayload = {
  sourceId: number;
  newLinkKeyIndex: number;
};
type ReorderLinksAction = {
  type: typeof LinkAction.REORDER_LINKS;
  payload: ReorderLinksPayload;
};

type DeleteLinkAction = {
  type: typeof LinkAction.DELETE_LINK;
  payload: number;
};

export type LinkActionTypes =
  | UpdateLinkAction
  | ReorderLinksAction
  | DeleteLinkAction;

export enum LinkAction {
  UPDATE_LINK,
  REORDER_LINKS,
  DELETE_LINK,
}

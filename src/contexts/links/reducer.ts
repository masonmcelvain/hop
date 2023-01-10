import {
  getLinkIdForStorageKey,
  getStorageKeyForLink,
  setStoredLinksAndKeys,
} from "@lib/webextension";
import { LinkState } from "@models/link-state";

export const Reducer = (
  state: LinkState,
  action: LinkActionTypes
): LinkState => {
  switch (action.type) {
    case LinkAction.REORDER_LINKS:
      return reorderLinks(state, action.payload);
    case LinkAction.DELETE_LINK:
      return deleteLink(state, action.payload);
  }
};

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

export type LinkActionTypes = ReorderLinksAction | DeleteLinkAction;

export enum LinkAction {
  REORDER_LINKS,
  DELETE_LINK,
}

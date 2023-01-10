import { getLinkIdForStorageKey } from "@lib/webextension";
import { LinkState } from "@models/link-state";

export type ReorderLinksData = {
  sourceId: number;
  newLinkKeyIndex: number;
};

/**
 * The caller must save the links to local storage.
 */
export function reorderLinks(
  prevState: LinkState,
  data: ReorderLinksData
): LinkState {
  const { sourceId } = data;
  let { newLinkKeyIndex } = data;
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

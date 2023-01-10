import { getStorageKeyForLink, setStoredLinksAndKeys } from "@lib/webextension";
import { LinkState } from "@models/link-state";

export const Reducer = (
  state: LinkState,
  action: LinkActionTypes
): LinkState => {
  switch (action.type) {
    case LinkAction.DELETE_LINK:
      return deleteLink(state, action.payload);
  }
};

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

type DeleteLinkAction = {
  type: typeof LinkAction.DELETE_LINK;
  payload: number;
};

export type LinkActionTypes = DeleteLinkAction;

export enum LinkAction {
  DELETE_LINK,
}

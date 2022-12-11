import {
  getLinkIdForStorageKey,
  getStorageKeyForLink,
  setNextStoredLinkId,
  setStoredLinks,
  setStoredLinksAndKeys,
} from "../../lib/webextension";

export const Reducer = (
  state: StateType,
  action: LinkActionTypes
): StateType => {
  switch (action.type) {
    case LinkAction.SET_STATE_FROM_STORAGE:
      return setStateFromStorage(action.payload);
    case LinkAction.ADD_LINK:
      return addLink(state, action.payload);
    case LinkAction.UPDATE_LINK:
      return updateLink(state, action.payload);
    case LinkAction.REORDER_LINKS:
      return reorderLinks(state, action.payload);
    case LinkAction.DELETE_LINK:
      return deleteLink(state, action.payload);
  }
};

function setStateFromStorage(payload: StateType): StateType {
  return payload;
}

function addLink(prevState: StateType, payload: AddLinkPayload): StateType {
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

function updateLink(
  prevState: StateType,
  payload: UpdateLinkPayload
): StateType {
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
  prevState: StateType,
  payload: ReorderLinksPayload
): StateType {
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

function deleteLink(prevState: StateType, linkKeyIndex: number): StateType {
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

type SetStateFromStorageAction = {
  type: typeof LinkAction.SET_STATE_FROM_STORAGE;
  payload: StateType;
};

type AddLinkPayload = {
  name: string;
  url: string;
  imageUrl: string;
};
type AddLinkAction = {
  type: typeof LinkAction.ADD_LINK;
  payload: AddLinkPayload;
};

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
  | SetStateFromStorageAction
  | AddLinkAction
  | UpdateLinkAction
  | ReorderLinksAction
  | DeleteLinkAction;

export type StateType = {
  linkKeys: string[];
  links: LinkData[];
  nextLinkId: number;
};

export enum LinkAction {
  SET_STATE_FROM_STORAGE,
  ADD_LINK,
  UPDATE_LINK,
  REORDER_LINKS,
  DELETE_LINK,
}

export type LinkData = {
  id: number;
  name: string;
  url: string;
  imageUrl: string;
};

import { setNextStoredLinkId, setStoredLinks } from "../../lib/webextension";

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
    case LinkAction.ADD_IMAGE_URL:
      return addImageUrl(state, action.payload);
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

  setStoredLinks(newLinks);
  setNextStoredLinkId(nextLinkId);
  return {
    ...prevState,
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
  let { newLinkIndex } = payload;
  const newLinks = [...prevState.links];

  const oldLinkIndex = newLinks.findIndex((link) => link.id === sourceId);

  // If dropped in an empty cell, put the card at the end of the array
  if (newLinkIndex >= newLinks.length) {
    newLinkIndex = newLinks.length - 1;
  }

  if (oldLinkIndex === newLinkIndex) {
    // If there is no positional change, do nothing.
    return prevState;
  }

  const [link] = newLinks.splice(oldLinkIndex, 1);
  newLinks.splice(newLinkIndex, 0, link);

  return {
    ...prevState,
    links: newLinks,
  };
}

function addImageUrl(
  prevState: StateType,
  payload: AddImageUrlPayload
): StateType {
  const { url, linkId } = payload;

  const newLinks = modifyLink(prevState.links, linkId, (link: LinkData) => ({
    ...link,
    imageUrl: url,
  }));

  setStoredLinks(newLinks);
  return {
    ...prevState,
    links: newLinks,
  };
}

function deleteLink(prevState: StateType, linkIndex: number): StateType {
  const newLinks = [...prevState.links];
  newLinks.splice(linkIndex, 1);

  setStoredLinks(newLinks);
  return {
    ...prevState,
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
  newLinkIndex: number;
};
type ReorderLinksAction = {
  type: typeof LinkAction.REORDER_LINKS;
  payload: ReorderLinksPayload;
};

type AddImageUrlPayload = {
  url: string;
  linkId: number;
};
type AddImageUrlAction = {
  type: typeof LinkAction.ADD_IMAGE_URL;
  payload: AddImageUrlPayload;
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
  | AddImageUrlAction
  | DeleteLinkAction;

export type StateType = {
  links: LinkData[];
  nextLinkId: number;
};

export enum LinkAction {
  SET_STATE_FROM_STORAGE,
  ADD_LINK,
  UPDATE_LINK,
  REORDER_LINKS,
  ADD_IMAGE_URL,
  DELETE_LINK,
}

export type LinkData = {
  id: number;
  name: string;
  url: string;
  imageUrl: string;
};

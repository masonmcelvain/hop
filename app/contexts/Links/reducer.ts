import {
  setNextStoredLinkId,
  setStoredLinks,
} from "../../lib/chrome/SyncStorage";

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
  const { name, url, sectionIndex, imageUrl } = payload;

  const newLinks: LinkData[][] = JSON.parse(JSON.stringify(prevState.links));
  if (sectionIndex > newLinks.length) {
    throw new Error(
      `Trying to insert a link into section that does not exist: ${sectionIndex}`
    );
  }

  const currentLinkId = prevState.nextLinkId;
  const nextLinkId = currentLinkId + 1;

  const newLink: LinkData = {
    id: currentLinkId,
    name,
    url,
    imageUrl,
  };
  newLinks[sectionIndex].push(newLink);

  setStoredLinks(newLinks);
  setNextStoredLinkId(nextLinkId);
  return {
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
 * Modify the order of the cards by relocating a card. Relocation can be
 * between grids.
 *
 * @param sourceId Id of the card being moved.
 * @param newLinkIndex Index to move the source link to.
 * @param newGridIndex The index of the grid the card is being moved to.
 */
function reorderLinks(
  prevState: StateType,
  payload: ReorderLinksPayload
): StateType {
  const { sourceId, newGridIndex } = payload;
  let { newLinkIndex } = payload;

  const removeFromGrid = prevState.links.find((grid) =>
    grid.some((link) => link.id === sourceId)
  );
  if (!removeFromGrid) {
    // If source is unknown, do nothing.
    console.log(`Unkown sourceId in reorderLinks(): ${sourceId}`);
    return prevState;
  }
  const oldGridIndex = prevState.links.findIndex(
    (grid) => grid === removeFromGrid
  );
  const oldLinkIndex = removeFromGrid.findIndex((link) => link.id === sourceId);

  if (oldLinkIndex === newLinkIndex && oldGridIndex === newGridIndex) {
    // If there is no positional change, do nothing.
    return prevState;
  }

  // If dropped in an empty cell, put the card at the end of the array
  if (newLinkIndex >= removeFromGrid.length) {
    newLinkIndex = removeFromGrid.length - 1;
  }

  // Delete the card from the old cards
  const [link] = removeFromGrid.splice(oldLinkIndex, 1);

  const insertIntoGrid =
    oldGridIndex === newGridIndex
      ? removeFromGrid
      : prevState.links[newGridIndex];

  // Insert the card into the new cards
  insertIntoGrid.splice(newLinkIndex, 0, link);

  const newLinks = [...prevState.links];
  if (oldGridIndex !== newGridIndex) {
    newLinks.splice(oldGridIndex, 1, removeFromGrid);
  }
  newLinks.splice(newGridIndex, 1, insertIntoGrid);

  setStoredLinks(newLinks);
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

function deleteLink(
  prevState: StateType,
  payload: DeleteLinkPayload
): StateType {
  const { cellIndex, gridIndex } = payload;
  const newLinks: LinkData[][] = JSON.parse(JSON.stringify(prevState.links));
  newLinks[gridIndex].splice(cellIndex, 1);

  setStoredLinks(newLinks);
  return {
    ...prevState,
    links: newLinks,
  };
}

function modifyLink(
  prevLinks: LinkData[][],
  linkId: number,
  callback: (link: LinkData) => LinkData
): LinkData[][] {
  const newLinks = [...prevLinks];
  let returnEarly = false;

  newLinks.forEach((section, i) => {
    section.forEach((link, j) => {
      if (link.id === linkId) {
        newLinks[i][j] = callback(link);
        returnEarly = true;
        return;
      }
    });
    if (returnEarly) {
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
  sectionIndex: number;
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
  newGridIndex: number;
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

type DeleteLinkPayload = {
  cellIndex: number;
  gridIndex: number;
};
type DeleteLinkAction = {
  type: typeof LinkAction.DELETE_LINK;
  payload: DeleteLinkPayload;
};

export type LinkActionTypes =
  | SetStateFromStorageAction
  | AddLinkAction
  | UpdateLinkAction
  | ReorderLinksAction
  | AddImageUrlAction
  | DeleteLinkAction;

export type StateType = {
  links: LinkData[][];
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

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
    case LinkAction.UPDATE_LINK_ORDER:
      return updateLinkOrder(state, action.payload);
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

/**
 * Modify the order of the cards by relocating a card. Relocation can be
 * between grids.
 *
 * @param sourceId Id of the card being moved.
 * @param newLinkIndex Index to move the source link to.
 * @param newGridIndex The index of the grid the card is being moved to.
 */
function updateLinkOrder(
  prevState: StateType,
  payload: UpdateLinkOrderPayload
): StateType {
  const { sourceId, newGridIndex } = payload;
  let { newLinkIndex } = payload;

  const removeFromGrid = prevState.links.find((grid) =>
    grid.some((link) => link.id === sourceId)
  );
  if (!removeFromGrid) {
    // If source is unknown, do nothing.
    console.log(`Unkown sourceId in updateLinkOrder(): ${sourceId}`);
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
    links: newLinks,
    ...prevState,
  };
}

function addImageUrl(
  prevState: StateType,
  payload: AddImageUrlPayload
): StateType {
  const { url, linkId } = payload;
  const newLinks: LinkData[][] = JSON.parse(JSON.stringify(prevState.links));
  let returnEarly = false;

  newLinks.forEach((section, i) => {
    section.forEach((link, j) => {
      if (link.id === linkId) {
        newLinks[i][j].imageUrl = url;
        returnEarly = true;
        return;
      }
    });
    if (returnEarly) {
      return;
    }
  });

  setStoredLinks(newLinks);
  return {
    links: newLinks,
    ...prevState,
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
    links: newLinks,
    ...prevState,
  };
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

type UpdateLinkOrderPayload = {
  sourceId: number;
  newLinkIndex: number;
  newGridIndex: number;
};
type UpdateLinkOrderAction = {
  type: typeof LinkAction.UPDATE_LINK_ORDER;
  payload: UpdateLinkOrderPayload;
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
  | UpdateLinkOrderAction
  | AddImageUrlAction
  | DeleteLinkAction;

export type StateType = {
  links: LinkData[][];
  nextLinkId: number;
};

export enum LinkAction {
  SET_STATE_FROM_STORAGE,
  ADD_LINK,
  UPDATE_LINK_ORDER,
  ADD_IMAGE_URL,
  DELETE_LINK,
}

export type LinkData = {
  id: number;
  name: string;
  url: string;
  imageUrl: string;
};

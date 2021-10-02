import { setNextStoredLinkId, setStoredLinks } from "../../lib/chrome/SyncStorage";

export const Reducer = (state: StateType, action: LinkActionTypes): StateType => {
  switch (action.type) {
    case LinkAction.SET_LINKS:
      return setLinks(state, action.payload);
    case LinkAction.SET_NEXT_LINK_ID:
      return setNextLinkId(state, action.payload);
    case LinkAction.ADD_LINK:
      return addLink(state, action.payload);
    case LinkAction.ADD_IMAGE_URL:
      return addImageUrl(state, action.payload);
    case LinkAction.DELETE_LINK:
      return deleteLink(state, action.payload);
  }
};

function setLinks(prevState: StateType, links: LinkData[][]): StateType {
  return {
    links,
    nextLinkId: prevState.nextLinkId,
  };
}

function setNextLinkId(prevState: StateType, nextLinkId: number): StateType {
  return {
    links: prevState.links,
    nextLinkId,
  };
}

function addLink(
  prevState: StateType,
  payload: AddLinkPayload
): StateType {
  const {name, url, sectionIndex, imageUrl} = payload;

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
    nextLinkId: nextLinkId,
  };
}

export function addImageUrl(
  prevState: StateType,
  payload: AddImageUrlPayload
): StateType {
  const {url, linkId} = payload;
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
    nextLinkId: prevState.nextLinkId,
  };
}

export function deleteLink(
  prevState: StateType,
  payload: DeleteLinkPayload
): StateType {
  const {cellIndex, gridIndex} = payload;
  const newLinks: LinkData[][] = JSON.parse(JSON.stringify(prevState.links));
  newLinks[gridIndex].splice(cellIndex, 1);
  setStoredLinks(newLinks);
  return {
    links: newLinks,
    nextLinkId: prevState.nextLinkId,
  };
}

// export type addLinkType = (
//   linkName: string,
//   linkUrl: string,
//   sectionIndex: number,
//   imageUrl: string
// ) => void;

// export type addImageUrlType = (
//   url: string,
//   id: number,
// ) => void;

// export type deleteLinkType = (cellIndex: number, gridIndex: number) => void;

type SetLinksAction = {
  type: typeof LinkAction.SET_LINKS;
  payload: LinkData[][];
};

type SetNextLinkIdAction = {
  type: typeof LinkAction.SET_NEXT_LINK_ID;
  payload: number;
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

export type LinkActionTypes = SetLinksAction | SetNextLinkIdAction | AddLinkAction | AddImageUrlAction | DeleteLinkAction;

export type StateType = {
  links: LinkData[][];
  nextLinkId: number;
};

export enum LinkAction {
  SET_LINKS,
  SET_NEXT_LINK_ID,
  ADD_LINK,
  ADD_IMAGE_URL,
  DELETE_LINK,
}

export type LinkData = {
  id: number;
  name: string;
  url: string;
  imageUrl: string;
};

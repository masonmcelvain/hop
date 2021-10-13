import * as React from "react";
import {
  setNextStoredLinkId,
  setStoredLinks,
  StorageKey,
} from "../../lib/chrome/SyncStorage";
import { Reducer, LinkAction, StateType, LinkActionTypes } from "./reducer";

const InitialState: StateType = {
  links: [],
  nextLinkId: 0,
  hasDragEvent: false,
};

export const LinksContext = React.createContext<{
  state: StateType;
  dispatch: React.Dispatch<LinkActionTypes>;
}>({
  state: InitialState,
  dispatch: () => null,
});

export const LinksProvider = ({
  children,
}: {
  children: React.ReactChild;
}): JSX.Element => {
  const [state, dispatch] = React.useReducer(Reducer, InitialState);

  // Initialize state from chrome storage
  React.useEffect(() => {
    chrome.storage.sync.get(null, (result) => {
      const payload: StateType = {
        links: state.links,
        nextLinkId: state.nextLinkId,
        hasDragEvent: false,
      };

      // Initialize links
      if (StorageKey.STORED_LINKS in result) {
        payload.links = result[StorageKey.STORED_LINKS];
      } else {
        setStoredLinks(state.links);
      }

      // Set the next linkid
      if (StorageKey.NEXT_LINK_ID in result) {
        payload.nextLinkId = result[StorageKey.NEXT_LINK_ID];
      } else {
        setNextStoredLinkId(state.nextLinkId);
      }

      dispatch({
        type: LinkAction.SET_STATE_FROM_STORAGE,
        payload,
      });
    });
  }, []);

  return (
    <LinksContext.Provider value={{ state, dispatch }}>
      {children}
    </LinksContext.Provider>
  );
};

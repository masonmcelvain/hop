import * as React from "react";
import {
  setNextStoredLinkId,
  setStoredLinks,
} from "../../lib/chrome/SyncStorage";
import { STORAGE } from "../../types/StorageEnum";
import { Reducer, LinkAction, StateType, LinkActionTypes } from "./reducer";

const InitialState: StateType = {
  links: [[]],
  nextLinkId: 0,
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
      // Set the next linkid
      if (STORAGE.NEXT_LINK_ID in result) {
        dispatch({
          type: LinkAction.SET_NEXT_LINK_ID,
          payload: result[STORAGE.NEXT_LINK_ID],
        });
      } else {
        setNextStoredLinkId(state.nextLinkId);
      }

      // Initialize links
      if (STORAGE.STORED_LINKS in result) {
        dispatch({
          type: LinkAction.SET_LINKS,
          payload: result[STORAGE.STORED_LINKS],
        });
      } else {
        setStoredLinks(state.links);
      }
    });
  }, []);

  return (
    <LinksContext.Provider value={{ state, dispatch }}>
      {children}
    </LinksContext.Provider>
  );
};

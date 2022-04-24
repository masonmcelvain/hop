import * as React from "react";
import browser from "webextension-polyfill";
import {
  setNextStoredLinkId,
  setStoredLinks,
  StorageKey,
} from "../../lib/webextension";
import { Reducer, LinkAction, StateType, LinkActionTypes } from "./reducer";

const InitialState: StateType = {
  links: [],
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

  // Initialize state from browser storage
  React.useEffect(() => {
    const payload: StateType = {
      links: state.links,
      nextLinkId: state.nextLinkId,
    };

    browser.storage.sync.get([StorageKey.STORED_LINKS, StorageKey.NEXT_LINK_ID]).then((result) => {
      // Initialize links
      const storedLinks = result[StorageKey.STORED_LINKS];
      storedLinks ?
        payload.links = storedLinks :
        setStoredLinks(state.links);

      // Set the next linkid
      const nextLinkId = result[StorageKey.NEXT_LINK_ID];
      nextLinkId ?
        payload.nextLinkId = nextLinkId :
        setNextStoredLinkId(state.nextLinkId);

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

import * as React from "react";
import browser from "webextension-polyfill";
import {
  setNextStoredLinkId,
  setStoredLinksAndKeys,
  StorageKey,
} from "../../lib/webextension";
import { Reducer, LinkAction, StateType, LinkActionTypes } from "./reducer";

const InitialState: StateType = {
  linkKeys: [],
  links: [],
  nextLinkId: 0,
};

function cleanseStoredState(): void {
  setStoredLinksAndKeys(InitialState.links, InitialState.linkKeys);
  setNextStoredLinkId(InitialState.nextLinkId);
}

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

  React.useEffect(() => {
    const initializeState = async () => {
      const {
        [StorageKey.NEXT_LINK_ID]: nextLinkId,
        [StorageKey.LINK_STORAGE_KEYS]: linkKeys,
      } = await browser.storage.local.get([
        StorageKey.LINK_STORAGE_KEYS,
        StorageKey.NEXT_LINK_ID,
      ]);

      if (nextLinkId && linkKeys?.length > 0) {
        const storedLinks = await browser.storage.local.get(linkKeys);
        const links = linkKeys.map((key: string) => storedLinks[key]) ?? [];
        if (links.length > 0) {
          dispatch({
            type: LinkAction.SET_STATE_FROM_STORAGE,
            payload: {
              nextLinkId,
              linkKeys,
              links,
            },
          });
          return;
        }
      }
      cleanseStoredState();
    };
    initializeState();
  }, []);

  return (
    <LinksContext.Provider value={{ state, dispatch }}>
      {children}
    </LinksContext.Provider>
  );
};

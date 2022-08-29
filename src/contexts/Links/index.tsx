import * as React from "react";
import browser from "webextension-polyfill";
import {
  getStorageKeyForLink,
  setNextStoredLinkId,
  setStoredLinksAndKeys,
  StorageKey,
} from "../../lib/webextension";
import { getLegacyLinks } from "./getLegacyLinks";
import {
  Reducer,
  LinkAction,
  StateType,
  LinkActionTypes,
  LinkData,
} from "./reducer";

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

  const initializeState = React.useCallback(async (): Promise<void> => {
    const payload: StateType = {
      linkKeys: state.linkKeys,
      links: state.links,
      nextLinkId: state.nextLinkId,
    };

    const fetchLegacyLinks = async () => await getLegacyLinks();

    type StorageArea =
      | browser.Storage.Static["sync"]
      | browser.Storage.Static["local"];
    const getFromStorage = async (storageArea: StorageArea) => {
      storageArea
        .get([StorageKey.LINK_STORAGE_KEYS, StorageKey.NEXT_LINK_ID])
        .then((result) => {
          const nextLinkId = result[StorageKey.NEXT_LINK_ID];
          const storedLinkKeys = result[StorageKey.LINK_STORAGE_KEYS];

          if (nextLinkId && storedLinkKeys && storedLinkKeys.length > 0) {
            payload.nextLinkId = nextLinkId;
            payload.linkKeys = storedLinkKeys;
            storageArea.get(storedLinkKeys).then((result) => {
              const storedLinks = storedLinkKeys.map(
                (key: string) => result[key] as LinkData
              );
              payload.links = storedLinks;

              dispatch({
                type: LinkAction.SET_STATE_FROM_STORAGE,
                payload,
              });
              return true;
            });
          } else if (nextLinkId) {
            // Migrate legacy links to new storage format
            fetchLegacyLinks().then((legacyLinks) => {
              if (legacyLinks && legacyLinks.length > 0) {
                payload.nextLinkId = nextLinkId;
                payload.links = legacyLinks;
                payload.linkKeys = legacyLinks.map((link) =>
                  getStorageKeyForLink(link)
                );

                setStoredLinksAndKeys(legacyLinks, payload.linkKeys);
                dispatch({
                  type: LinkAction.SET_STATE_FROM_STORAGE,
                  payload,
                });
                return true;
              } else {
                cleanseStoredState();
              }
            });
          } else {
            cleanseStoredState();
          }
          return false;
        });
    };

    if (!getFromStorage(browser.storage.local)) {
      getFromStorage(browser.storage.sync);
    }
  }, []);

  React.useEffect(() => {
    initializeState();
  }, [initializeState]);

  return (
    <LinksContext.Provider value={{ state, dispatch }}>
      {children}
    </LinksContext.Provider>
  );
};

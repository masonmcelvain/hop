import {
  setNextStoredLinkId,
  setStoredLinksAndKeys,
  StorageKey,
} from "@lib/webextension";
import {
  LinkState,
  parseLinkKeys,
  parseNextLinkId,
  parseStoredLinks,
} from "@models/link-state";
import { useLinkStore } from "hooks/useLinkStore";
import * as React from "react";
import browser from "webextension-polyfill";
import { LinkActionTypes, Reducer } from "./reducer";

export * from "./reducer";

const InitialState: LinkState = {
  linkKeys: [],
  links: [],
  nextLinkId: 0,
};

function cleanseStoredState(): void {
  setStoredLinksAndKeys(InitialState.links, InitialState.linkKeys);
  setNextStoredLinkId(InitialState.nextLinkId);
}

export const LinksContext = React.createContext<{
  state: LinkState;
  dispatch: React.Dispatch<LinkActionTypes>;
}>({
  state: InitialState,
  dispatch: () => null,
});

export const LinksProvider = ({ children }: { children: React.ReactChild }) => {
  const [state, dispatch] = React.useReducer(Reducer, InitialState);
  const setLinks = useLinkStore((state) => state.setLinks);

  React.useEffect(() => {
    const initializeState = async () => {
      const {
        [StorageKey.NEXT_LINK_ID]: storedNextLinkId,
        [StorageKey.LINK_STORAGE_KEYS]: storedLinkKeys,
      } = await browser.storage.local.get([
        StorageKey.LINK_STORAGE_KEYS,
        StorageKey.NEXT_LINK_ID,
      ]);
      const nextLinkId = parseNextLinkId(storedNextLinkId);
      const linkKeys = parseLinkKeys(storedLinkKeys);

      if (nextLinkId && linkKeys?.length) {
        const storedLinks = parseStoredLinks(
          await browser.storage.local.get(linkKeys)
        );
        const links =
          (storedLinks && linkKeys.map((key) => storedLinks[key])) ?? [];
        if (links.length) {
          setLinks({ nextLinkId, linkKeys, links });
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

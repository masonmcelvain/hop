import { useColorMode, useTheme } from "@chakra-ui/react";
import {
  setNextStoredLinkId,
  setStoredColorMode,
  setStoredLinksAndKeys,
  StorageKey,
} from "@lib/webextension";
import { parseColorMode } from "@models/color-mode";
import {
  parseLinkKeys,
  parseNextLinkId,
  parseStoredLinks,
} from "@models/link-state";
import { useLinkStore } from "hooks/useLinkStore";
import * as React from "react";
import browser from "webextension-polyfill";
import Page from "./Page";

export default function App() {
  const { setColorMode } = useColorMode();
  const { initialColorMode } = useTheme();

  React.useEffect(() => {
    const initializeColorMode = async () => {
      const data = await browser.storage.local.get(StorageKey.COLOR_MODE);
      const storedMode = parseColorMode(data[StorageKey.COLOR_MODE]);
      storedMode
        ? setColorMode(storedMode)
        : setStoredColorMode(initialColorMode);
    };
    initializeColorMode();
  }, [initialColorMode, setColorMode]);

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
      // Cleanse stored state.
      setStoredLinksAndKeys([], []);
      setNextStoredLinkId(0);
    };
    initializeState();
  }, [setLinks]);

  return <Page />;
}

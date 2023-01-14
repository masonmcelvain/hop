import { useLinkStore } from "./useLinkStore";
import * as React from "react";
import browser from "webextension-polyfill";
import {
   setNextStoredLinkId,
   setStoredLinksAndKeys,
   StorageKey,
} from "@lib/webextension";
import {
   parseLinkKeys,
   parseNextLinkId,
   parseStoredLinks,
} from "@models/link-state";

export function useInitializeState() {
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
}

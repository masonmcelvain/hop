import { ColorMode } from "@chakra-ui/react";
import { LinkData } from "../../contexts/Links/reducer";

export function setStoredColorMode(colorMode: ColorMode): void {
  setStorageWithKey(StorageKey.COLOR_MODE, colorMode);
}

export function setStoredLinks(links: LinkData[]): void {
  setStorageWithKey(StorageKey.STORED_LINKS, links);
}

export function setNextStoredLinkId(id: number): void {
  setStorageWithKey(StorageKey.NEXT_LINK_ID, id);
}

function setStorageWithKey(key: string, value) {
  const storageObj = {};
  storageObj[key] = value;
  chrome.storage.sync.set(storageObj);
}

/**
 * Keys for values in chrome storage
 */
export enum StorageKey {
  COLOR_MODE = "COLOR_MODE",
  STORED_LINKS = "STORED_LINKS",
  NEXT_LINK_ID = "NEXT_LINK_ID",
}
